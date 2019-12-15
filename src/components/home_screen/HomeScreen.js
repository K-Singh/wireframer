import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireFrameLinks from './WireFrameLinks'
import { getFirestore } from 'redux-firestore';
import M from "materialize-css";
class HomeScreen extends Component {

    constructor(props){
        super(props);
        this.modal = React.createRef();
    }

    handleNewList = () => {
        let newListData = {
            name: 'Unnamed wireframe',
            owner: this.props.auth.uid,
            controls: [],
            height: 500,
            width: 500,
            time: Date.now(),
        }
        const fireStore = getFirestore();
        let newList = fireStore.collection("wireframes").doc();
        newList.set(newListData);

        this.props.history.push({
            pathname: "wireFrame/" + newList.id,
            key: newList.id,
        });
    }
    style = {
        marginTop: '100px'
      }
    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div>
                <div ref={this.modal} style={{position: "absolute", width:500, height: 500, zindex: 5}} id="modal1" className="modal modal-fixed-footer hoverable z-depth-2">HELLo</div>
            <div className="z-depth-2 white" style={{
                paddingBottom: '70px', borderRadius: '0 0 10px 10px',
            }}>
                
                <div className="dashboard container">
                    <div className="row">
                        <div className="col s12 m4">
                            <WireFrameLinks modal={this.modal}/>
                        </div>

                        <div style={this.style} className="waves-effect waves-light col s7 push-s3 pink lighten-1 white-text hoverable">
                             <h2 className="center-align"><i><u>Wireframer</u></i></h2><br />
                                 <h5 className="center-align">UI Mockup creater</h5>
                         </div>

                         <div style={{ marginTop: '15px' }} className="home_new_list_container ">
                                {/* {<button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New To Do List
                                </button>} */}
                                <a onClick={this.handleNewList} style={{ marginTop: '15px' }} className="col s7 push-s3 waves-effect waves-light btn-large pink lighten-1 hoverable rounded">
                                    <i className="material-icons right">library_add</i>Create a Wireframe
                                </a>
                            </div>
                        </div>
                   
                    </div>
                    
                </div>
                </div>
            
        );
    }


    componentDidMount() {
        const options = {
            onOpenStart: () => {
              console.log("Open Start");
            },
            onOpenEnd: () => {
              console.log("Open End");
            },
            onCloseStart: () => {
              console.log("Close Start");
            },
            onCloseEnd: () => {
              console.log("Close End");
            },
            inDuration: 250,
            outDuration: 250,
            opacity: 0.5,
            dismissible: false,
            startingTop: "4%",
            endingTop: "10%"
          };
        M.Modal.init(this.modal, options);
    }
}



const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes', orderBy: ["time", "desc"] },
    ]),
)(HomeScreen);