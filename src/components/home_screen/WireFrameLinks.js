import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireFrameCard from './WireFrameCard';
import WireFrameDelete from './WireFrameDelete';

class WireFrameLinks extends React.Component {
    render() {
        const wireFrames = this.props.wireFrames;
        console.log(wireFrames);
        return (
            <div className="todo-lists section">
                {wireFrames && wireFrames.filter(wireFrame => wireFrame.owner === this.props.auth.uid).map(wireFrame => (
                    <div className="row">
                        <Link className="col s8"to={'/wireFrame/' + wireFrame.id} key={wireFrame.id}>
                            <WireFrameCard className="center-align" wireFrame={wireFrame} />
                        </Link>
                        <WireFrameDelete modal ={this.props.modal}  listToDelete={this.props.listToDelete} deleteAnim={this.props.deleteAnim} wireFrame = {wireFrame}/>
                    </div>
                ))}
            </div>
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

export default compose(connect(mapStateToProps))(WireFrameLinks);