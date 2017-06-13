import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionVisibilityIcon from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import { grey600 } from 'material-ui/styles/colors';
import BasemapList from './BasemapList';
import OpacitySlider from '../toolbar/OpacitySlider';
import './BasemapCard.css';

const styles = {
    container: {
        paddingBottom: 0,
    },
    visibility: {
        width: 56,
        height: 56,
        padding: 8,
        position: 'absolute',
        right: 32,
        top: 0,
    },
    headerText: {
        position: 'relative',
        width: 210,
        top: '50%',
        transform: 'translateY(-50%)',
        paddingRight: 0,
    },
    body: {
        padding: 0,
    },
    slider: {
        margin: 8
    }
};

// Basemap card shown in left layers panel
const BasemapCard = (props) => {
    const {
        title,
        subtitle,
        opacity,
        isExpanded,
        isVisible,
        toggleBasemapExpand,
        toggleBasemapVisibility,
        changeBasemapOpacity
    } = props;

    return (
        <Card
            className='BasemapCard'
            containerStyle={styles.container}
            expanded={isExpanded}
            onExpandChange={toggleBasemapExpand}
        >
            <CardHeader
                className='BasemapCard-header'
                title={title}
                subtitle={subtitle}
                showExpandableButton={true}
                textStyle={styles.headerText}
            >
                <IconButton
                    style={styles.visibility}
                    onClick={toggleBasemapVisibility}
                    tooltip='Toggle visibility'
                >
                    {isVisible ? (
                        <ActionVisibilityIcon color={grey600} />
                    ) : (
                        <ActionVisibilityOffIcon color={grey600} />
                    )}
                </IconButton>
            </CardHeader>

            <CardText expandable={true} style={styles.body}>
                <BasemapList {...props} />
                <div className='BasemapCard-toolbar'>
                    <OpacitySlider
                        opacity={opacity}
                        onChange={opacity => changeBasemapOpacity(opacity)}
                    />
                </div>
            </CardText>
        </Card>
    )
};

BasemapCard.propTypes= {
    opacity: PropTypes.number,
    isVisible: PropTypes.bool,
    isExpanded: PropTypes.bool,
    toggleBasemapExpand: PropTypes.func,
    toggleBasemapVisibility: PropTypes.func,
    changeBasemapOpacity: PropTypes.func,
};

BasemapCard.defaultProps = {
    opacity: 1,
    isVisible: true,
    isExpanded: true,
};

export default BasemapCard;
