import React from 'react';

class WireFrameCard extends React.Component {

    render() {
        const { wireFrame } = this.props;
        console.log("WireFrameCard, wireframe.id: " + wireFrame.id);
        return (
            <div className="card z-depth-2 rounded grey lighten-4 todo-list-link hoverable">
                <div className="card-content grey-text text-darken-4 item_card">
                    <span className="center-align card-title">{wireFrame.name}</span>
                </div>
            </div>
        );
    }
}
export default WireFrameCard;