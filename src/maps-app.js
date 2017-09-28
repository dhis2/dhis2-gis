// TODO: Refactoring needed
import GIS from './core/index.js';
import app from './app/index.js';
import appInit from './app-init';
import '../scss/app.scss';

// New React stuff
import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import { init, config, getUserSettings, getManifest, getInstance as getD2 } from 'd2/lib/d2';
// import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

import configOptionStore from './store/configOptionStore'; // TODO: Needen?

import Root from './components/Root';
import debounce from 'lodash.debounce';
import storeFactory from './store';
import { loadPrograms } from './actions/programs';
import { loadExternalLayers } from './actions/externalLayers';
import { resizeScreen } from './actions/ui';

const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line

log.setLevel(process.env.NODE_ENV === 'production' ? log.levels.INFO : log.levels.TRACE);

const a = document.createElement('a');
function getAbsoluteUrl(url) {
    a.href = url;
    return a.href;
}

const store = storeFactory();

function configI18n(userSettings) {
    // Sources
    const uiLocale = userSettings.keyUiLocale;

    if (uiLocale !== 'en') {
        config.i18n.sources.add(`i18n/i18n_app_${uiLocale}.properties`);
    }
    config.i18n.sources.add(`i18n/i18n_app.properties`);
}

/*
render(
    <Root store={store} />,
    document.getElementById('app')
);
*/

// Temporary fix to know that initial data is loaded
GIS.onLoad = () => {
    store.dispatch(loadExternalLayers());
};

// Window resize listener: http://stackoverflow.com/questions/35073669/window-resize-react-redux
window.addEventListener('resize', debounce(() => store.dispatch(resizeScreen(window.innerWidth, window.innerHeight)), 150));

getManifest('manifest.webapp')
    .then((manifest) => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        config.baseUrl = `${baseUrl}/api/27`;
        log.info(`Loading: ${manifest.name} v${manifest.version}`);
        log.info(`Built ${manifest.manifest_generated_at}`);

        // Include all API endpoints in use by this app
        config.schemas = [
            'organisationUnit',
            'organisationUnitGroupSet',
            'program',
            'programStage',
            'externalMapLayer',
            'optionSet'
        ];
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(init)
    .then((d2) => {
        // App init
        // log.debug('D2 initialized', d2);

        if (!d2.currentUser.authorities.has('F_SYSTEM_SETTING')) {
            document.write(d2.i18n.getTranslation('access_denied'));
            return;
        }

        // Load alternatives
        const api = d2.Api.getApi();
        const apiBaseUrl = getAbsoluteUrl(api.baseUrl);
        const baseUrl = apiBaseUrl.substr(0, apiBaseUrl.lastIndexOf('/api/'));

        Promise.all([
            api.get('locales/ui'),
            api.get('userSettings', { useFallback: false }),
        ]).then((results) => {
            // Locales
            const locales = (results[0] || []).map(locale => ({ id: locale.locale, displayName: locale.name }));

            const userSettingsNoFallback = results[1];

            configOptionStore.setState({
                locales,
                userSettingsNoFallback,
            });
            log.debug('Got settings options:', configOptionStore.getState());

            // Load current system settings and configuration
            // settingsActions.load();

            render(
                <Root d2={getD2()} store={store} />,
                document.getElementById('app')
            );
        });

    }, (err) => {
        log.error('Failed to initialize D2:', JSON.stringify(err));
        document.write(`D2 initialization error: ${err}`);
    });
