import React from 'react';


class WireFrameDelete extends React.Component {
   
    render() {
        const { wireFrame } = this.props;
        console.log("WireFrameCard, wireframe.id: " + wireFrame.id);
        return (

            <a href="#modal1" data-target="modal1" className="col s8 center-align modal-trigger">
            <div className="center-align  z-depth-2 rounded grey lighten-4 todo-list-link hoverable">
            <div className=" center-align grey-text text-darken-4 item_card">
                <span className="material-icons center-align card-title ">delete</span>
            </div>
        </div>
        
        </a>
        );
    }
}
export default WireFrameDelete;