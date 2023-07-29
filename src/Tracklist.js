import styles from './Tracklist.module.css'
import React from 'react';
import Track from './Track';
export default function Tracklist(props){
    const {Tracks} = props;
    const {onAddTrack} = props;
    return(
        <div className={styles.container}>
            <ul className={styles.Tracklist}>
                {Tracks.map((track) => (
                    <li key={track.id}>
                        <Track track = {track} >
                            <button className = {styles.trackAction} key = {track.id} onClick={()=>onAddTrack(track)}>+</button>
                        </Track>
                    </li>
                ))}
            </ul>
        </div>
    )
}