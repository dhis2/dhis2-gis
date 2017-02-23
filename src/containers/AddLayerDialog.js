import { connect } from 'react-redux'
import AddLayerDialog from '../components/layer/AddLayerDialog';
import { addOverlay, closeLayersDialog } from '../actions';

const mapStateToProps = (state) => ({
    overlays: state.overlays,
    layersDialogOpen: state.ui.layersDialogOpen,
});

const mapDispatchToProps = (dispatch) => ({
    // onRequestClose: closeLayersDialog,
    onRequestClose: () => dispatch(closeLayersDialog()),
    onLayerSelect: (layer) => {
        dispatch(addOverlay(layer));
        dispatch(closeLayersDialog());
    },
});

/*
const mapDispatchToProps = ({
    onRequestClose: closeLayersDialog,
});
*/

export default connect(mapStateToProps, mapDispatchToProps)(AddLayerDialog);







