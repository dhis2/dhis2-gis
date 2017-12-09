import * as types from '../constants/actionTypes';
import {
    setFiltersFromPeriod,
    setIndicatorInColumns,
    setProgramIndicatorInColumns,
    setReportingRateInColumns,
    addOrgUnitLevelsToRows,
    addOrgUnitGroupsToRows,
    addUserOrgUnitsToRows,
    toggleOrgUnitNodeInRows,
} from '../util/analytics';

const layerEdit = (state = null, action) => {
    let columns;
    let newState;

    switch (action.type) {

        case types.OVERLAY_EDIT:
            delete action.payload.img;
            return action.payload;

        case types.OVERLAY_CANCEL:
            return null;

        case types.LAYER_EDIT_PROGRAM_SET:
            return {
                ...state,
                program: {
                    ...action.program,
                },
                columns: [],
                programStage: null,
                styleDataElement: null,
            };

        case types.LAYER_EDIT_PROGRAM_STAGE_SET:
            return {
                ...state,
                programStage: {
                    ...action.programStage,
                },
                columns: [],
                styleDataElement: null,
            };

        case types.LAYER_EDIT_VALUE_TYPE_SET:
            return {
                ...state,
                valueType: action.valueType,
            };

        case types.LAYER_EDIT_INDICATOR_GROUP_SET:
            return {
                ...state,
                indicatorGroup: action.groupId,
            };

        case types.LAYER_EDIT_INDICATOR_SET:
            return {
                ...state,
                columns: setIndicatorInColumns(action.indicator),
            };

        case types.LAYER_EDIT_PROGRAM_INDICATOR_SET:
            return {
                ...state,
                columns: setProgramIndicatorInColumns(action.programIndicator),
            };

        case types.LAYER_EDIT_DATA_ELEMENT_GROUP_SET:
            return {
                ...state,
                dataElementGroup: {
                    id: action.dataElementGroup.id,
                    name: action.dataElementGroup.name,
                },
            };

        case types.LAYER_EDIT_DATA_ELEMENT_SET:
            console.log('LAYER_EDIT_DATA_ELEMENT_SET');

            return state;

        case types.LAYER_EDIT_DATA_SET_ITEM_SET:
            return {
                ...state,
                columns: setReportingRateInColumns(action.dataSetItem),
            };

        case types.LAYER_EDIT_PERIOD_TYPE_SET:
            return {
                ...state,
                periodType: action.periodType,
                filters: null,
            };

        case types.LAYER_EDIT_PERIOD_SET:
            return {
                ...state,
                filters: setFiltersFromPeriod(action.period),
            };

        case types.LAYER_EDIT_START_DATE_SET:
            return {
                ...state,
                startDate: action.startDate,
            };

        case types.LAYER_EDIT_END_DATE_SET:
            return {
                ...state,
                endDate: action.endDate,
            };

        case types.LAYER_EDIT_AGGREGATION_TYPE_SET:
            return {
                ...state,
                aggregationType: action.aggregationType,
            };

        case types.LAYER_EDIT_FILTER_ADD:
            return {
                ...state,
                columns: [
                    ...state.columns,
                    action.filter || {
                        dimension: null,
                        name: null,
                        filter: null,
                    }
                ]
            };

        case types.LAYER_EDIT_FILTER_REMOVE:
            columns = state.columns.filter(c => c.filter !== undefined); // Also used for style data element without filter

            if (!columns || !columns[action.index]) {
                return state;
            }

            return {
                ...state,
                columns: [
                    ...state.columns.filter(c => c.filter === undefined),
                    ...columns.filter((c, i) => i !== action.index)
                ]
            };

        case types.LAYER_EDIT_FILTER_CHANGE:
            columns = state.columns.filter(c => c.filter !== undefined); // Also used for style data element without filter

            if (!columns || !columns[action.index]) {
                return state;
            }

            columns[action.index] = action.filter;

            return {
                ...state,
                columns: [
                    ...state.columns.filter(c => c.filter === undefined),
                    ...columns
                ]
            };

        case types.LAYER_EDIT_STYLE_DATA_ITEM_SET:
            return {
                ...state,
                styleDataItem: action.dataItem,
            };

        // Set options to data element option set
        case types.LAYER_EDIT_STYLE_DATA_ITEM_OPTIONS_SET:
            newState = {
                ...state,
                styleDataItem: {
                    ...state.styleDataItem,
                    optionSet: {
                        ...state.styleDataItem.optionSet,
                        options: action.options,
                    },
                },
            };

            delete newState.method;
            delete newState.classes;
            delete newState.colorScale;

            return newState;

        case types.LAYER_EDIT_CLASSIFICATION_SET:
            newState = {
                ...state,
                method: action.method,
            };

            if (newState.styleDataItem) {
                delete newState.styleDataItem.optionSet;
            }

            return newState;


        case types.LAYER_EDIT_COLOR_SCALE_SET:
            newState = {
                ...state,
                colorScale: action.colorScale,
                classes: action.colorScale.length,
                method: state.method || 2, // TODO: Make constant
            };

            if (newState.styleDataItem) {
                delete newState.styleDataItem.optionSet;
            }

            return newState;

        case types.LAYER_EDIT_EVENT_COORDINATE_FIELD_SET:
            newState = { ...state };

            if (action.fieldId === 'event') { // Default
                delete newState.eventCoordinateField;
            } else {
                newState.eventCoordinateField = action.fieldId;
            }

            return newState;

        case types.LAYER_EDIT_EVENT_CLUSTERING_SET:
            return {
                ...state,
                eventClustering: action.checked,
            };

        case types.LAYER_EDIT_EVENT_POINT_RADIUS_SET:
            return {
                ...state,
                eventPointRadius: action.radius,
            };

        case types.LAYER_EDIT_EVENT_POINT_COLOR_SET:
            return {
                ...state,
                eventPointColor: action.color,
            };

        case types.LAYER_EDIT_ORGANISATION_UNIT_GROUP_SET:
            return {
                ...state,
                organisationUnitGroupSet: action.organisationUnitGroupSet,
            };

        case types.LAYER_EDIT_ORGANISATION_UNIT_LEVELS_SET:
            return {
                ...state,
                rows: addOrgUnitLevelsToRows(state.rows, action.levels),
            };

        case types.LAYER_EDIT_ORGANISATION_UNIT_GROUPS_SET:
            return {
                ...state,
                rows: addOrgUnitGroupsToRows(state.rows, action.groups),
            };

        case types.LAYER_EDIT_USER_ORGANISATION_UNITS_SET:
            return {
                ...state,
                rows: addUserOrgUnitsToRows(state.rows, action.userOrgUnits),
            };

        case types.LAYER_EDIT_ORGANISATIOM_UNIT_TOGGLE:
            return {
                ...state,
                rows: toggleOrgUnitNodeInRows(state.rows, action.orgUnit),
            };

        case types.LAYER_EDIT_MIN_SET:
            return {
                ...state,
                min: action.min,
            };

        case types.LAYER_EDIT_MAX_SET:
            return {
                ...state,
                max: action.max,
            };

        case types.LAYER_EDIT_STEPS_SET:
            return {
                ...state,
                steps: action.steps,
            };

        default:
            return state;

    }
};

export default layerEdit;