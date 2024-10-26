export default function NavigationBar({renderHomePage, currentView, renderCreateCommunity, displayCommunityList}){
  return(
    <div className="navigation-bar">
      <div className="home-link" onClick={renderHomePage}>Home</div>
      <hr className="delimiter"/>
      <button className= {`${currentView === "create-community"? 'create-community-button-red':'create-community-button' }`} onClick={renderCreateCommunity}>+ Create Community</button>
      <hr className="delimiter"/>
      <p className="community-label">COMMUNITIES</p>
      <div className="community-list">
        {displayCommunityList()}
      </div>
      </div>
  );
}
