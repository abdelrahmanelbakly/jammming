import styles from './SearchBar.module.css'
export default function SearchBar(props){
    const {handleSearch} = props;
    const {getSearchKey} = props;
    return(
            <form className= {styles.search} onSubmit={handleSearch}>
                <input
                    className = {styles.searchInput}
                    type = 'text' 
                    id = 'TargetSongs' 
                    name = 'TargetSongs' 
                    onChange={e => getSearchKey(e.target.value)}/>
                <input className = {styles.submitButton} type = 'submit' value = 'Search'/>
            </form>
    )
}