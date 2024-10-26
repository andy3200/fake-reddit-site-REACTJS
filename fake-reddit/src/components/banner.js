export default function Banner({currentView, setCurrentView, updateSearchInput, handleSearch, renderHomePage}){
  return(
    <div id="header" className="header">
      <div className="header-name" onClick={() => {renderHomePage()}}>Phreddit</div>
      <input className="search-bar"type="text" placeholder="Search Phreddit..." onChange={updateSearchInput}onKeyDown={handleSearch}/>
      <button className= {`${currentView === "createPost"? 'create-post-button-red':'create-post-button' }`} onClick={() => {setCurrentView('createPost');}}>+ Create Post</button>
    </div>
  );
}