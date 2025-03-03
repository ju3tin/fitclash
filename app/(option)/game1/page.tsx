
import FAQ from '../../../components/faq';

export default function Home() {
    return (
        <>
        <div className="container">
        <video style={{display:'none'}} className="input_video"></video>
        <canvas className="output_canvas" width="1280px" height="720px"></canvas>
       <div className="loading">
            <div className="spinner"></div>
            <div className="message">
                Loading
            </div>
        </div>
        <a className="abs logo" href="https://github.com/baoanh1310/pose_demo" target="_blank">
            <div style={{ }}>
                <img className="logo" src="logo_white.png" alt="" style={{}} />
                <span className="title">Group 02 - AI Project</span>
            </div>
        </a>
        <div className="shoutout">
            <div>
                <a href="https://github.com/baoanh1310/pose_demo">
                    Click here for more info
                </a>
            </div>
        </div>
    </div>
    <div className="control-panel">
    </div>
    </>
    );
}