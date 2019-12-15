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
        this.deleteAnim = false;
        this.listToDelete = new Object();
       
        
    }

    resetStyle = () => {
        let str = this.modal.current.style.cssText;
        
        if(!str.includes("translateY"))
        this.modal.current.style = " position: absolute; width:500px; height: 200px; zindex: 5; top: -700px; transition: transform 1s ease-in; transform: translateY(700px);"
        else
        this.modal.current.style = " position: absolute; width:500px; height: 200px; zindex: 5; top: -700px; transition: transform 1s ease-in;"
    }



    deleteList = () => {
        if(this.listToDelete.id != null){
           
            const fireStore = getFirestore();
            
            fireStore.collection("wireframes").doc(this.listToDelete.id).delete();
        }
        this.resetStyle();
       
    }

    handleNewList = () => {
        const fireStore = getFirestore();
        
        
        let newListData = {
            name: 'Unnamed Wireframe',
            owner: this.props.auth.uid,
            controls: [],
            height: 500,
            width: 500,
            time: Date.now(),
        }
        
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
                
            <div className="z-depth-2 white" style={{
                paddingBottom: '70px', borderRadius: '0 0 10px 10px',
            }}>
                
                <div className="dashboard container">
                    <div className="row">
                        <div className="col s1 pull-s4 m4">
                            <WireFrameLinks listToDelete = {this.listToDelete} modal = {this.modal} deleteAnim = {this.deleteAnim}/>
                        </div>

                        <div style={this.style} className="waves-effect waves-light col s7 push-s3 blue lighten-1 white-text hoverable">
                             <h2 className="center-align"><i><u>Wireframer</u></i></h2><br />
                                 <h5 className="center-align">UI Mockup creater</h5>
                         </div>

                        
                        </div>
                        <div className="row">
                        <div style={{ marginTop: '15px' }} className="home_new_frame_container ">
                                <a onClick={this.handleNewList} style={{ marginTop: '15px' }} className= "col s6 push-s3 waves-effect waves-light btn-large blue lighten-1 hoverable rounded">
                                    Create a Wireframe
                                </a>
                            </div>
                        </div>
                   
                    </div>
                    
                </div>
                <div ref={this.modal} style={{position: "absolute", width:500, height: 200, zindex: 5, top: -700, transition: "transform 1s ease-in"}} className="center-align card blue darken-1 hoverable z-depth-2">
                                <div style={{margin: 10, fontSize: 20}} className="card white">
                                    <span>Would you like to delete this list?</span><br/><br/><br/><br/>
                                    <button onClick={this.deleteList} className="btn">Yes</button><button onClick={this.resetStyle} className="btn">No</button>
                                </div>
                                </div>
                </div>
            
        );
    }


    componentDidMount() {
        
      
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