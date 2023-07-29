import styles from './Track.module.css'
export default function Track(props){
    const {track} = props;
    return(
        <div className={styles.Track}>
            <div >
                <div style = {{fontWeight: "bold"}}>{track.name}</div>
                <div>{track.artists[0].name}|{track.album.name}</div>   
            </div>
            {props.children}
        </div>
    )
}