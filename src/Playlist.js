import styles from './Playlist.module.css';
import Track from './Track';
export default function Playlist(props){
    const {PlaylistTracks} = props;
    const {PlaylistName} = props;
    const {onRemoveTrack} = props;
    const {onPlaylistRename} = props;
    const {onAddPlaylist} = props;
    return(
        <div className = {styles.container}>
            <input type='text'  className = {styles.input} onChange = {onPlaylistRename} value = {PlaylistName}/>
            <ul className={styles.Playlist}>
                {PlaylistTracks.map((track) => (
                    <li key={track.id}>
                        <Track track = {track} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10%' }}>
                            <button className = {styles.trackAction}  key = {track.id} onClick={() => onRemoveTrack(track)}>-</button>
                        </Track>
                    </li>
                ))}
            </ul>
            <button  className = {styles.save} onClick={() => onAddPlaylist() }>SAVE TO SPOTIFY</button>
        </div>
    )
}