import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';

import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { Modal, Button } from 'react-materialize';
import { thisExpression } from '@babel/types';
import {Rnd} from 'react-rnd';
class WireFrameScreen extends Component {



    state = {
        name: '',
        owner: '',
        controls: [],
        select: new Object(),
        exit: false
    }


    constructor(props){
        super(props);
        
        this.currentWidth = 500;
        this.currentHeight = 500;
       
       
        if(this.props.wireFrame != null){
            console.log("help!!!!");
            this.currentWidth = this.props.wireFrame.width;
            this.currentHeight = this.props.wireFrame.height;
            
        }
        this.widthRef = React.createRef();
        this.heightRef = React.createRef();
        this.dimensionRef = React.createRef();
        this.frameRef = React.createRef();

        this.colorRef = React.createRef();
        this.borderColorRef = React.createRef();
        this.borderWidthRef = React.createRef();
        this.borderRadiusRef = React.createRef();
        this.fontSizeRef = React.createRef();
        this.fontColorRef = React.createRef();
        this.valueRef = React.createRef();
        this.submitRef = React.createRef();
        this.scale = 1;
        this.scaleRef = React.createRef();
    }


    

    sortCriteria = 'none';
    changedTime = false;

    onSave(e, id){
        const fireStore = getFirestore();
       
        fireStore.collection("wireframes").doc(id).update({
           controls: this.state.controls,
           width: parseInt(this.currentWidth, 10),
           height: parseInt(this.currentHeight, 10)
        });

        

    }


    onZoomIn(e){
        if(this.scale != 8){
        this.scale = 2*this.scale;
        this.frameRef.current.style = "width: "+this.currentWidth+"px; height: "+this.currentHeight+"px; display: block; position: relative; transform: scale("+this.scale+","+this.scale+"); transform-origin: 0 0;"
        }
        this.setState({select: null});
    }

    onZoomOut(e){
        if(this.scale != 0.125){
        this.scale = this.scale/2;
        this.frameRef.current.style = "width: "+this.currentWidth+"px; height: "+this.currentHeight+"px; display: block; position: relative; transform: scale("+this.scale+","+this.scale+");"
        }
        this.setState({select: null});
    }

    onExit(){
        this.setState({exit: true})
    }

    stopResize(e, dir, ref, delta, pos, obj){
      
       
        obj.width += delta.width;
        obj.height += delta.height;
        
        this.setState({select: obj});

        obj.x = pos.x;
        obj.y = pos.y;
        this.setState({select: obj});
    }


    updateDetails = () => {
        let obj = this.state.select;
        
        
            obj.color = this.colorRef.current.value;
            obj.borderColor = this.borderColorRef.current.value;
            obj.borderWidth = this.borderWidthRef.current.value + "px";
            obj.borderRadius = this.borderRadiusRef.current.value + "px";
        
        if(obj.type != "container"){
            obj.fontSize = this.fontSizeRef.current.value + "px";
            obj.fontColor = this.fontColorRef.current.value;
            obj.value = this.valueRef.current.value;
        }
        
        let newArray = this.state.controls;
        let filterArray = newArray.filter(control => control != obj);
        filterArray.push(obj);
        this.setState({select: obj, controls: filterArray});
    }

    stopDrag(e, d, obj){
        
        obj.x = d.x;
        obj.y = d.y;
        this.setState({select: obj});
    }


    enableControlDetails(obj) {
        
        if(obj && obj.type === "container"){
            this.colorRef.current.disabled = 0;
            this.colorRef.current.value = obj.color;
            
            this.borderColorRef.current.disabled = 0;
            this.borderColorRef.current.value = obj.borderColor;

            this.borderWidthRef.current.disabled = 0; 
            this.borderWidthRef.current.value = obj.borderWidth.substring(0, obj.borderWidth.length -2); 

            this.borderRadiusRef.current.disabled = 0;
            this.borderRadiusRef.current.value = obj.borderRadius.substring(0, obj.borderRadius.length -2);

            this.submitRef.current.disabled = 0;
        }else if(obj){
            this.colorRef.current.disabled = 0;
            this.colorRef.current.value = obj.color;
            
            this.borderColorRef.current.disabled = 0;
            this.borderColorRef.current.value = obj.borderColor;

            this.borderWidthRef.current.disabled = 0; 
            this.borderWidthRef.current.value = obj.borderWidth.substring(0, obj.borderWidth.length -2); 

            this.borderRadiusRef.current.disabled = 0;
            this.borderRadiusRef.current.value = obj.borderRadius.substring(0, obj.borderRadius.length -2);
            

            this.fontSizeRef.current.disabled = 0;
            this.fontSizeRef.current.value = obj.fontSize.substring(0, obj.fontSize.length -2);

            this.fontColorRef.current.disabled = 0;
            this.fontColorRef.current.value = obj.fontColor;           

            this.valueRef.current.disabled = 0;
            this.valueRef.current.value = obj.value;
            this.submitRef.current.disabled = 0;
        }
    }

    disableControlDetails() {
        
            this.colorRef.current.disabled = 1;
            
            
            this.borderColorRef.current.disabled = 1;
            

            this.borderWidthRef.current.disabled = 1; 
            

            this.borderRadiusRef.current.disabled = 1;
            

            this.fontSizeRef.current.disabled = 1;
           
            this.fontColorRef.current.disabled = 1;

            this.valueRef.current.disabled = 1;
            this.submitRef.current.disabled = 1;
    }

    selectControl(e, obj) {
        e.stopPropagation();
        e.persist();
        
       
        //console.log(obj.ref);
        let newArray = this.state.controls;
        let filterArray = newArray.filter(control => control != obj);
        filterArray.push(obj);
        this.setState({select: obj, controls: filterArray});
        this.enableControlDetails(obj);
    }

    deSelectControl() {
        if(this.state.select != null){
        this.setState({select: null});
        this.disableControlDetails();
        }
    }

    renderControl = (controlObject) => {
        
        if(controlObject.type === "container"){
            return <div onClick={ (e) => this.selectControl(e, controlObject)} 
            style={{backgroundColor: controlObject.color, borderWidth: controlObject.borderWidth, borderStyle: "solid", 
            borderRadius: controlObject.borderRadius, borderColor: controlObject.borderColor, transform: "translate("+controlObject.x+"px, "+controlObject.y+"px)" , width: controlObject.width, 
            height: controlObject.height, position: "absolute", display: "inline-block", left: "0px",
             top:"0px", userSelect: "auto", boxSizing: "border-box", touchAction: "none"}} 
            bounds = "parent"
                default={{
                    x: controlObject.x,
                    y: controlObject.y,
                    width: controlObject.width,
                    height: controlObject.height,
                }}
                > </div>
        }else if(controlObject.type === "label"){
            return <div onClick={(e) => this.selectControl(e, controlObject)} 
            style={{backgroundColor: controlObject.color, borderWidth: controlObject.borderWidth, borderStyle: "solid", borderRadius: controlObject.borderRadius, borderColor: controlObject.borderColor,
        fontSize: controlObject.fontSize, color: controlObject.fontColor, transform: "translate("+controlObject.x+"px, "+controlObject.y+"px)" , width: controlObject.width, 
        height: controlObject.height, position: "absolute", display: "inline-block", left: "0px", top:"0px", userSelect: "auto", boxSizing: "border-box", touchAction: "none"}} 
            bounds = "parent"
                default={{
                    x: controlObject.x,
                    y: controlObject.y,
                    width: controlObject.width,
                    height: controlObject.height,
                }}
                >{controlObject.value}</div>
        }else if(controlObject.type === "button"){
            return <div onClick={(e) => this.selectControl(e, controlObject)} 
            style={{backgroundColor: controlObject.color, borderWidth: controlObject.borderWidth, borderStyle: "solid", borderRadius: controlObject.borderRadius, borderColor: controlObject.borderColor,
        fontSize: controlObject.fontSize, color: controlObject.fontColor, transform: "translate("+controlObject.x+"px, "+controlObject.y+"px)" , width: controlObject.width, 
        height: controlObject.height, position: "absolute", display: "inline-block", left: "0px", top:"0px", userSelect: "auto", boxSizing: "border-box", touchAction: "none"}}   className="btn"
            bounds = "parent"
                default={{
                    x: controlObject.x,
                    y: controlObject.y,
                    width: controlObject.width,
                    height: controlObject.height,
                }}
                >{controlObject.value}</div>
        }else if(controlObject.type === "textfield"){
            return <div onClick={(e) => this.selectControl(e, controlObject)} 
            style={{backgroundColor: controlObject.color, borderWidth: controlObject.borderWidth, borderStyle: "solid", borderRadius: controlObject.borderRadius, borderColor: controlObject.borderColor,
        fontSize: controlObject.fontSize, color: controlObject.fontColor, transform: "translate("+controlObject.x+"px, "+controlObject.y+"px)" , width: controlObject.width, 
    height: controlObject.height, position: "absolute", display: "inline-block", left: "0px", top:"0px", userSelect: "auto", boxSizing: "border-box", touchAction: "none"}}  
            bounds = "parent"
            type="text"
            
                default={{
                    x: controlObject.x,
                    y: controlObject.y,
                    width: controlObject.width,
                    height: controlObject.height,
                }}
                ><form style={{padding: 0, margin: 0, width: "100%", height: "100%", color: "inherit", fontSize: "inherit"}}><input style={{margin: 0, width: "100%", height: "100%", color: "inherit", fontSize: "inherit"}}type="text" value={controlObject.value}></input></form></div>
        }
    }

    renderRNDControl = (controlObject) => {
        
        if(controlObject.type === "container"){
            return <Rnd  onDragStop = { (e, d) => this.stopDrag(e, d, controlObject)} onResizeStop={(e, dir, ref, delta, pos) => this.stopResize(e, dir, ref, delta, pos, controlObject)}
            style={{backgroundColor: controlObject.color, borderWidth: controlObject.borderWidth, borderStyle: "solid", 
            borderRadius: controlObject.borderRadius, borderColor: controlObject.borderColor}} 
            bounds = "parent"
            scale={this.scale}
            position={{x: controlObject.x, y: controlObject.y}}
            size={{width: controlObject.width, height: controlObject.height}}
                > 
                <div style={{width: 10, height: 10, left: -5, top: -5, position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: "100%", top: -5, transform: "translate(-5px,0)", position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: -5, top: "100%", transform: "translate(0,-5px)",position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: "100%", top: "100%", transform: "translate(-5px,-5px)", position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                
                
                
                </Rnd>
        }else if(controlObject.type === "label"){
            return <Rnd  onDragStop = { (e, d) => this.stopDrag(e, d, controlObject)} onResizeStop={(e, dir, ref, delta, pos) => this.stopResize(e, dir, ref, delta, pos, controlObject)}
            style={{backgroundColor: controlObject.color, borderWidth: controlObject.borderWidth, borderStyle: "solid", borderRadius: controlObject.borderRadius, borderColor: controlObject.borderColor,
        fontSize: controlObject.fontSize, color: controlObject.fontColor}} 
            bounds = "parent"
            scale={this.scale}
            position={{x: controlObject.x, y: controlObject.y}}
            size={{width: controlObject.width, height: controlObject.height}}
                >{controlObject.value}
                 <div style={{width: 10, height: 10, left: -5, top: -5, position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: "100%", top: -5, transform: "translate(-5px,0)", position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: -5, top: "100%", transform: "translate(0,-5px)",position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: "100%", top: "100%", transform: "translate(-5px,-5px)", position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                
                </Rnd>
        }else if(controlObject.type === "button"){
            return <Rnd  onDragStop = { (e, d) => this.stopDrag(e, d, controlObject)} onResizeStop={(e, dir, ref, delta, pos) => this.stopResize(e, dir, ref, delta, pos, controlObject)}
            style={{backgroundColor: controlObject.color, borderWidth: controlObject.borderWidth, borderStyle: "solid", borderRadius: controlObject.borderRadius, borderColor: controlObject.borderColor,
        fontSize: controlObject.fontSize, color: controlObject.fontColor}}   className="btn"
            bounds = "parent"
            position={{x: controlObject.x, y: controlObject.y}} scale={this.scale}
            size={{width: controlObject.width, height: controlObject.height}}
                >{controlObject.value}
                
                <div style={{width: 10, height: 10, left: -5, top: -5, position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: "100%", top: -5, transform: "translate(-5px,0)", position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: -5, top: "100%", transform: "translate(0,-5px)",position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: "100%", top: "100%", transform: "translate(-5px,-5px)", position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                
                </Rnd>
        }else if(controlObject.type === "textfield"){
            return <Rnd  onDragStop = { (e, d) => this.stopDrag(e, d, controlObject)} onResizeStop={(e, dir, ref, delta, pos) => this.stopResize(e, dir, ref, delta, pos, controlObject)}
            style={{backgroundColor: controlObject.color, borderWidth: controlObject.borderWidth, borderStyle: "solid", borderRadius: controlObject.borderRadius, borderColor: controlObject.borderColor,
        fontSize: controlObject.fontSize, color: controlObject.fontColor}}  
            bounds = "parent"
            type="text"
            scale={this.scale}
            position={{x: controlObject.x, y: controlObject.y}}
            size={{width: controlObject.width, height: controlObject.height}}
                >    
                <div style={{width: 10, height: 10, left: -5, top: -5, position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: "100%", top: -5, transform: "translate(-5px,0)", position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: -5, top: "100%", transform: "translate(0,-5px)",position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                <div style={{width: 10, height: 10, left: "100%", top: "100%", transform: "translate(-5px,-5px)", position: "absolute", backgroundColor: "white", borderStyle: "solid", borderWidth: 1, borderColor: "black"}}></div>
                
                    <form style={{padding: 0, margin: 0, width: "100%", height: "100%", color: "inherit", fontSize: "inherit"}}><input style={{margin: 0, width: "100%", height: "100%", color: "inherit", fontSize: "inherit"}}type="text" value={controlObject.value}></input></form>
                    </Rnd>
        }
    }

    createContainer = () => {
        let container = new Object();
        container.type = "container";
        container.width = 200;
        container.height = 200;
        container.color = "#ffffff"
        container.borderColor = "#000000";
        container.borderWidth = "1px";
        container.borderRadius = "3px";
        container.x = 0;
        container.y = 0;
        container.ref = React.createRef();
        
        this.setState({controls: this.state.controls.concat(container)});
    }

    createLabel = () => {
        let label = new Object();
        label.type = "label";
        label.width = 250;
        label.height = 25;
        label.color = "#ffffff"
        label.borderColor = "#000000";
        label.borderWidth = "0px";
        label.borderRadius = "3px";
        label.fontSize = "20px";
        label.fontColor = "#000000";
        label.value = "Prompt For Label";
        label.x = 0;
        label.y = 0;
        label.ref = React.createRef();
        
        this.setState({controls: this.state.controls.concat(label)});
    }

    createButton = () => {
        let button = new Object();
        button.type = "button";
        button.width = 250;
        button.height = 35;
        button.color = "#26a69a";
        button.borderColor = "#ffffff";
        button.borderWidth = "1px";
        button.borderRadius = "3px";
        button.fontSize = "20px";
        button.fontColor = "#ffffff";
        button.value = "Submit";
        button.x = 0;
        button.y = 0;
        button.ref = React.createRef();
        
        this.setState({controls: this.state.controls.concat(button)});
    }

    createTextfield = () => {
        let textfield = new Object();
        textfield.type = "textfield";
        textfield.width = 250;
        textfield.height = 35;
        textfield.color = "#ffffff";
        textfield.borderColor = "#000000";
        textfield.borderWidth = "0px";
        textfield.borderRadius = "0px";
        textfield.fontSize = "20px";
        textfield.fontColor = "#808080";
        textfield.value = "Input";
        textfield.x = 0;
        textfield.y = 0;
        textfield.ref = React.createRef();
        
        this.setState({controls: this.state.controls.concat(textfield)});
    }


    updateDimensions = () => {
        if(this.widthRef.current.value > 5000)
            this.widthRef.current.value = 5000;
        if(this.widthRef.current.value < 1)
            this.widthRef.current.value = 1;
        if(this.heightRef.current.value > 5000)
            this.heightRef.current.value = 5000;
        if(this.heightRef.current.value < 1)
            this.heightRef.current.value = 1;
        
        this.heightRef.current.value = Math.floor(this.heightRef.current.value);
        this.widthRef.current.value = Math.floor(this.widthRef.current.value);

        this.currentWidth = this.widthRef.current.value;
        this.currentHeight = this.heightRef.current.value;
       // let fireStore = getFirestore();
      //  fireStore.collection('wireframes').doc(this.props.wireFrame.id).update({ height: this.currentHeight })
       // fireStore.collection('wireframes').doc(this.props.wireFrame.id).update({ width: this.currentWidth })
       //ALL DATABASE CHANGES WHEN YOU SAVE
        this.scale = 1;
        this.frameRef.current.style = "width: "+this.currentWidth+"px; height: "+this.currentHeight+"px; display: block; position: relative; transform: scale(1,1);"
        this.dimensionRef.current.disabled = 1;
    }

    updateTime = () => {
        console.log("updating time")
        let fireStore = getFirestore();
        fireStore.collection('wireframes').doc(this.props.wireFrame.id).update({ time: Date.now() })
    }

    handleChange = (e) => {
        this.dimensionRef.current.disabled = 0;
        
    }
   


   

    componentDidMount(){
        if(this.props.wireFrame != null){
           
            this.widthRef.current.value = this.props.wireFrame.width;
            this.heightRef.current.value = this.props.wireFrame.height;
            this.dimensionRef.current.disabled = 1;
            this.submitRef.current.disabled = 1;
            this.frameRef.current.style = "width: "+this.props.wireFrame.width+"px; height: "+this.props.wireFrame.height+"px; display: block; position: relative; transform: scale(1,1);"
            this.scale = 1;



            const fireStore = getFirestore();
            let newArray = [];
            fireStore.collection("wireframes").doc(this.props.wireFrame.id).get().then(function(doc)  {
                doc.data().controls.map(control => 
                    newArray.push(control))

            }  );
            this.setState({controls: newArray}, () => {
                this.forceUpdate();
                console.log("State finished");
            })
          
           
        }

        
     
     
    }

    render() {
        const auth = this.props.auth;
        let wireFrame = this.props.wireFrame;
       
        if (!auth.uid || this.state.exit) {
            return <Redirect to="/" />;
        }

        if (!wireFrame)
            return <React.Fragment />

        if (!this.changedTime) {
            this.changedTime = true;
            this.updateTime();
        }
       
        return (
            <div style={{backgroundColor:  "#473850", marginTop: 10}} className="row lighten-2">
               <div style={{backgroundColor: "#424242"}}className="pull-s1 card col s2 rounded black-text" > 
                    <div style={{padding: 15}} className="card rounded pink lighten-1 white-text">
                        <div style={{margin: 0}}className="row">
                            
                            <div style={{fontSize: "3rem", cursor: "pointer"}} onClick={() => this.onZoomIn()} className="col s3 pull-s1 material-icons">zoom_in</div> 
                            <div style={{fontSize: "3rem", cursor: "pointer"}} onClick={() => this.onZoomOut()} className="col s3 pull-s1 material-icons">zoom_out</div>
                            <div style={{fontSize: "3rem", cursor: "pointer"}} onClick={(e) => this.onSave(e, this.props.wireFrame.id)} className="col s3 pull-s1 material-icons">save</div>
                            <div style={{fontSize: "3rem", cursor: "pointer"}} onClick={() => this.onExit()}className="col s3 pull-s1 material-icons">close</div>
                        </div>
                    </div>
                    <div className=" card rounded pink lighten-1 white-text">
                        <form style={{marginTop: 10, paddingBottom: 0}}>
                            <div style={{marginBottom: 10}} className="row">
                                <div className="col s2">Width:</div> 
                                <input ref={this.widthRef} onChange={this.handleChange} style={{fontSize: 15, height: 20}}className="white col s6 push-s3" type="number" min="1" max="5000" ></input>
                            </div>
                            <div style={{marginBottom: 10}} className="row">
                                <div className="col s2">Height:</div> 
                                <input ref={this.heightRef} onChange={this.handleChange} style={{fontSize: 15, height: 20}}className="white col s6 push-s3" type="number" min="1" max="5000" ></input>
                            </div>
                            <div className="row">
                                 
                                <button style={{marginTop: 10}} ref={this.dimensionRef} type="button" onClick={this.updateDimensions} className=" col s6 push-s3 btn">Update</button>
                            </div>
                        </form>
                    </div>
                    <div className=" card rounded pink lighten-1 white-text">
                        <div style={{paddingTop: 10, cursor: "pointer"}} onClick={this.createContainer}  className="row">
                            <div style={{height: 40}}className="col s8 push-s2 white white-text rounded"></div>
                            <div className="col s6 push-s3 white-text">Container</div>
                        </div>

                        <div style={{paddingTop: 10, cursor: "pointer"}} onClick={this.createLabel} className="row">
                            <div className="col s8 push-s2 center-align rounded white black-text">Input Label</div>
                            <div className="col s12 center-align white-text">Label</div>
                        </div>

                        <div style={{paddingTop: 10, cursor: "pointer"}} onClick={this.createButton} className="row">
                            <div className="col s8 push-s2 center-align btn white-text">Submit</div>
                            <div className="col s12 center-align white-text">Button</div>
                        </div>

                        <div style={{paddingTop: 10, paddingBottom: 10,  cursor: "pointer"}} onClick={this.createTextfield} className="row">
                            <form style={{marginTop: 0, padding: 0}} >
                                <input style={{fontSize: 15, height: 20}} value="Text Input" type="text" disabled={true} className="col s8 push-s2 center-align white black-text"></input>
                                <div className="col s12 center-align white-text">Textfield</div>
                            </form>
                        </div>
                    </div>
                </div>
               <div style={{marginTop: 7.5, paddingTop: 30, paddingLeft: 30, paddingRight: 30, height: 800, backgroundColor: "#424242"}} className="card col s8 black-text center-align" >
               <div ref={this.scaleRef} style={{height: 700, overflow:'auto', backgroundColor: "#424242"}} className="" >
                    <div ref={this.frameRef} style={{width: 500, height: 500, display: 'block', position: "relative"}} onClick={(e) => this.deSelectControl(e)} className="white">
                        {this.state.controls.filter(control => control != this.state.select).map(control => {
                           return this.renderControl(control)
                        }
                            )}{this.state.controls.filter(control => control === this.state.select).map(control =>
                               {return this.renderRNDControl(control)})}
                    </div>
                    </div>

               </div>
               <div style={{backgroundColor: "#424242"}}className="push-s1 card col s2 rounded black-text" > 
                    <div style={{padding: 15}} className="card rounded pink lighten-1 white-text">
                    <form style={{marginTop: 10, paddingBottom: 0}}>
                            <div style={{marginBottom: 10}} className="row">
                                <span style={{fontSize: 10}} className="pull-s2 col s10">Border Width:</span> 
                                <input ref={this.borderWidthRef} disabled style={{fontSize: 10, height: 20}}className="push-s1 white col s2" type="number" min="1" max="100" step="1" ></input>
                            </div>
                            <div style={{marginBottom: 10}} className="row">
                                <div style={{fontSize: 10}} className="pull-s2 col s10">Border Radius:</div> 
                                <input ref={this.borderRadiusRef} disabled style={{fontSize: 10, height: 20}}className="white col s2 push-s1" type="number" min="1" max="200" step="1" ></input>
                            </div>
                            <div style={{marginBottom: 10}} className="row">
                                <div style={{fontSize: 10}} className="pull-s2 col s8">Border Color:</div> 
                                <input ref={this.borderColorRef} disabled style={{}}className="white col s3 push-s2" type="color" ></input>
                            </div>
                            <div style={{marginBottom: 10}} className="row">
                                <div style={{fontSize: 10}} className="pull-s2 col s8">Back Color:</div> 
                                <input ref={this.colorRef} disabled style={{}}className="white col s3 push-s2" type="color" ></input>
                            </div>
                            <div style={{marginBottom: 10}} className="row">
                                <div style={{fontSize: 10}} className="pull-s2 col s8">Text Color:</div> 
                                <input ref={this.fontColorRef} disabled style={{}}className="white col s3 push-s2" type="color" ></input>
                            </div>
                            <div style={{marginBottom: 10}} className="row">
                                <div style={{fontSize: 10}} className="pull-s2 col s8">Text Size:</div> 
                                <input ref={this.fontSizeRef} disabled style={{fontSize: 10, height: 20}} className="white col s3 push-s2" type="number" min="1" max="100" step="1" ></input>
                            </div>
                            <div style={{marginBottom: 10}} className="row">
                                <div style={{fontSize: 10}} className="push-s3 col s6">Text Value:</div> 
                                <input ref={this.valueRef} disabled style={{fontSize: 10, height: 20}} className="white col s12 " type="textarea"  ></input>
                            </div>
                            <div className="row">
                                 
                                <input type="button" style={{marginTop: 10}} ref={this.submitRef} value="update" onClick={this.updateDetails} className=" col s6 push-s3 btn"></input>
                            </div>
                        </form>
                    </div>
                    
                    
                </div>
            </div>
        );
    }
}

const SORT_BY_TASK_INCREASING = 'sort_by_task_increasing';
const SORT_BY_TASK_DECREASING = 'sort_by_task_decreasing';
const SORT_BY_DUE_DATE_INCREASING = 'sort_by_due_date_increasing';
const SORT_BY_DUE_DATE_DECREASING = 'sort_by_due_date_decreasing';
const SORT_BY_STATUS_INCREASING = 'sort_by_status_increasing';
const SORT_BY_STATUS_DECREASING = 'sort_by_status_decreasing';

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const  wireFrames  = state.firestore.data;
   
    const wireFrameOutline = !!wireFrames ? wireFrames.wireframes : null;
    const wireFrame = !!wireFrameOutline ? wireFrameOutline[id] : null;
    if (wireFrame)
        wireFrame.id = id;
   
    

    return {
        wireFrame,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(WireFrameScreen);