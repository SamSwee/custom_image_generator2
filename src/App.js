import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const canvasRef = useRef(null);
    const imageObj = new Image();

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        setSubmitted(true);

        imageObj.onload = function() {
            ctx.drawImage(imageObj, 0, 0);
            ctx.font = "40pt alataregular";
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillText(name, (canvas.width / 2) - 5, 180);
        };
        imageObj.src = "nft_square_stackup.png";
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Generate your own image for your NFT</h1>
            {!submitted ? (
                <>
                    <div id="sample" className="sample-image text-center mt-5">
                        <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-5">
                            <h2>Suzaku</h2>
                            <p>is participating in<br />StackUp's Filecoin Campaign</p>
                        </div>
                    </div>
                    <div className="input-group mt-5">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Type your StackUp name here"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-outline-primary" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <canvas id="myCanvas" ref={canvasRef} width="500" height="500" style={{ display: 'block', margin: 'auto' }}></canvas>
                    <a id="tweet" href={`https://twitter.com/intent/tweet?text=Check out my participation in StackUp's Filecoin Campaign!&url=YOUR_WEBSITE_URL`} target="_blank" rel="noreferrer" style={{opacity: 1}}>
                        Tweet
                    </a>
                </>
            )}
        </div>
    );
}

export default App;