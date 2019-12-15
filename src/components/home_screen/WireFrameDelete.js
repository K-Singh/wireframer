import React from 'react';


class WireFrameDelete extends React.Component {
   
    handleClick() {
       
        let str = this.props.modal.current.style.cssText;
        this.props.listToDelete.id = this.props.wireFrame.id;
        if(!str.includes("translateY"))
        this.props.modal.current.style = " position: absolute; width:500px; height: 200px; zindex: 5; top: -700px; transition: transform 1s ease-in; transform: translateY(700px);"
        else
        this.props.modal.current.style = " position: absolute; width:500px; height: 200px; zindex: 5; top: -700px; transition: transform 1s ease-in;"
   }

    render() {
        const { wireFrame } = this.props;
        console.log("WireFrameCard, wireframe.id: " + wireFrame.id);
        return (

            <div onClick={this.handleClick.bind(this)} className="col s8 center-align">
            <div className="center-align  z-depth-2 rounded grey lighten-4 todo-list-link hoverable">
            <div className=" center-align grey-text text-darken-4 item_card">
                <span className="material-icons center-align card-title ">delete</span>
            </div>
        </div>
        
        </div>
        );
    }
}
export default WireFrameDelete;