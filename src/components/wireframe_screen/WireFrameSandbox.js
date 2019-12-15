import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';


class WireFrameSandbox extends React.Component {
    render() {
        const wireFrames = this.props.wireFrames;
        console.log(wireFrames);
        return (
            <div></div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state.firebase.auth.uid)
    return {
        wireFrames: state.firestore.ordered.wireframes,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(WireFrameSandbox);