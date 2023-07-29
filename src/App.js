import './App.css';
import Playlist from './Playlist';
import SearchBar from './SearchBar';
import Tracklist from './Tracklist';
import { useEffect,useState } from 'react';
function App() {
  //setup spotify api calls requirements
  const CLIENT_ID = "Your_Client_ID"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPES = "playlist-modify-public playlist-modify-private";
  //setup required states
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [tracks, setTracks] = useState([]);
  const [PlaylistName, setPlayListName] = useState(' ');
  const [PlaylistTracks, setPlaylistTracks] = useState([]);
  // get spotify authentication token
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    
    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }
    setToken(token)
}, [])

//get tracks data from spotify
  const search = async (e) => {
    e.preventDefault();
    const url = new URL("https://api.spotify.com/v1/search");
    url.searchParams.append("q", searchKey);
    url.searchParams.append("type", "track");
    url.searchParams.append("limit", 20);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });// fetch data then store in response

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json(); 
        setTracks(data.tracks.items); //set tracks state so it can be reused
    } catch (error) {
        console.error("Error fetching data:", error); //show error if needed
    }
};

  
  //adding tracks 
  function addTrackToPlayList(track){
    const trackExists = PlaylistTracks.some((existingTrack) => existingTrack.id === track.id);
    if(!trackExists){ //check if the track clicked is not already in playlist
      setPlaylistTracks((prevPlaylist) =>[...prevPlaylist,track]); // add track if condition approves
    }

  //remove clicked tracks from playlist
  }function removeTrackFromPlayList(track){
      setPlaylistTracks((prevTracks) => prevTracks.filter((prevtrack) => prevtrack.id !== track.id));
  }

  //set playlist name
  function handlePlaylistRename(event){
    const newName = event.target.value;
    setPlayListName(newName);
    console.log(PlaylistName);
  }
  // get spotify userID to help in creating/modifying users playlists
  async function  getUserID(){
    const url = new URL("https://api.spotify.com/v1/me");
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
          const data = await response.json(); // Parse the response as JSON
          return data.id;
    }catch (error) {
      console.error("Error fetching data:", error); 
    }
  }
  // add tracks to previously created spotify playlists using Playlist_id attribute
  async function addTracks(Playlist_id){
    const userID = await getUserID();
    const trackuri = PlaylistTracks.map((track)=>track.uri)
    const url = `https://api.spotify.com/v1/users/${userID}/playlists/${Playlist_id}/tracks`
    try{
      await fetch(url,{
        method: 'POST',
        headers:{
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackuri,
        }),
      })
    }catch(error){
      console.error("error adding tracks",error);
    }
  }
  //create playlist on spotify
  async function handlePlaylistSubmit(e){
    const userID = await getUserID();
    console.log(userID);
    const url = `https://api.spotify.com/v1/users/${userID}/playlists`
    try{
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: PlaylistName,
          description: "myPlaylist",
          public: false,
        }),  
        
      })
      const PlaylistData = await response.json();
      addTracks(PlaylistData.id);//add tracks to this playlist
    }catch(error){
      console.error("Error posting Playlist", error);
    }
  }
  
  return (
    <div className='starter'>
      {!token ?
        <div className='login'>
          <a href={`${AUTH_ENDPOINT}
            ?client_id=${CLIENT_ID}
            &redirect_uri=${REDIRECT_URI}
            &response_type=${RESPONSE_TYPE}
            &scope=${SCOPES}`}>
            Login to Spotify
          </a>
        </div>
        :
        <div className='App'>
          <SearchBar handleSearch = {search} getSearchKey = {setSearchKey}></SearchBar>
          <div className='listsContainer'>
            <Tracklist Tracks = {tracks} onAddTrack = {addTrackToPlayList}/>
            <Playlist 
              PlaylistName = {PlaylistName} 
              PlaylistTracks = {PlaylistTracks} 
              onRemoveTrack = {removeTrackFromPlayList} 
              onPlaylistRename ={handlePlaylistRename}
              onAddPlaylist = {handlePlaylistSubmit}/>
        </div>
        </div>}
    </div>
    
  );
}

export default App;
