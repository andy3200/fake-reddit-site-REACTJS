import Model from '../models/model.js';
import {useState} from 'react';
import Banner from './banner.js';
import NavigationBar from './navigation-bar.js';
import {CommunityForm, Header, PostContainer, Post, PostContent, PostForm, Comment} from './main-page.js';

let model = new Model();
export default function Phreddit() {
  const [displayedPosts, setDisplayedPosts] = useState(model.data.posts.slice().sort((a,b) => b.postedDate - a.postedDate)); //Variable that stores the posts that are displayed
  const [currentView, setCurrentView] = useState('home');
  const [headerTitle, setHeaderTitle] = useState("All Posts");
  const [sortSelected, setSortSelected] = useState('new');
  const [communityDescription, setCommunityDescription] = useState(null);
  const [communityList, setCommunityList] = useState(model.data.communities);
  const [searchInput, setSearchInput] = useState("");
  const [currentPostID, setCurrentPostID] = useState("0");
  const [replying, setReplying] = useState(false);
  const [currentCommentID, setCurrentCommentID] = useState("0");
  const [comments, setComments] = useState(model.data.comments);
  const [communityMemberCount, setCommunityMemberCount] = useState(1);
  const [createCommunityData,setCreateCommunityData] = useState({
    name : '',
    description: '',
    username: '',
  });
  const [communitySelected, setCommunitySelected] = useState('Select a community');
  const [linkFlairSelected, setLinkFlairSelected] = useState('Select a linkFlair');
  const [currentCommunity,setCurrentCommunity] = useState('');
  const [linkFlairCreated, setLinkFlairCreated] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [createLinkFlair, setCreateLinkFlair] = useState(false); //whether we create linkflair or not 
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
  const [linkflairDropdownOpen, setlinkflairDropdownOpen] = useState(false);
  const [warnings, setWarnings] = useState({   //uses an object to represent all the warnings. 
    community: false,
    flair: false,
    title: false,
    content: false,
    username: false,
  });
  const [cwarning1, setCWarning1] = useState(null);
  const [cwarning2, setCWarning2] = useState(null);
  const [cwarning3, setCWarning3] = useState(null);

  function renderHomePage(){
    setDisplayedPosts(model.data.posts.slice().sort((a,b) => b.postedDate - a.postedDate));
    setHeaderTitle("All Posts");
    setCurrentView('home');
    setSortSelected('new');
    setCommunityDescription(null);
    setCurrentPostID('0');
    setReplying(false);
    setCurrentCommentID("0");
  }

  
  /*  
  given the postid, find which community it belongs to 
  param PostID: the ID of the Post 
  return: returns the community object that belongs to the post
  */
  function find_community_of_post(postID){ 
    for (let community of model.data.communities) {
      if(community.postIDs.includes(postID)){
        return community;
      }
    }
    return null;
  }

  /*  
  given the flair id, find the content of the flair
  param ID: the ID of the flair
  return: returns the content of the flair (in string form)
  */
  function find_linkflair(ID){
    for (let linkFlair of model.data.linkFlairs) {
      if(linkFlair.linkFlairID === ID){
        return linkFlair.content;
      }
    }
    return '';
  }

  /*  
  given the flair content, find the ID of the flair
  return: returns the id of the flair
  */
  function find_linkflair_ID(content) {
    if(content ==='' || content === 'No LinkFlair'){
      return '';
    }
    const linkFlair = model.data.linkFlairs.find(flair => flair.content === content);
    if(linkFlair != undefined){
      return linkFlair.linkFlairID;
    }else{
      return '';
    }
  }


  /*  
  function to display the timestamp 
  param postDate: the Date object that represents the post date
  return: a string that describes the difference between current time and post date
  */
  function time_stamp_display(postDate){ 
    const present_time = new Date();
    const msdiff = present_time - postDate; // time diff in milliseconds 
    const seconddiff = Math.floor(msdiff/1000); // time diff in seconds 
    const minutediff = Math.floor(seconddiff/60); //time diff in mins
    const hourdiff = Math.floor(minutediff/60); //time diff in mins
    const daydiff = Math.floor(hourdiff/24); //time diff in days
    const monthdiff= Math.floor(daydiff/30); //time diff in months 
    const yeardiff = Math.floor(monthdiff/12); //time diff in years 
    
    if (seconddiff < 60) {
      if(seconddiff === 1){
        return `${seconddiff} second ago`;
      }
      return `${seconddiff} seconds ago`;
    }else if (minutediff < 60) {
      if( minutediff=== 1){
        return `${minutediff} minute ago`;
      }
      return `${minutediff} minutes ago`;
    } else if (hourdiff < 24) {
      if( hourdiff=== 1){
        return `${hourdiff} hour ago`;
      }
      return `${hourdiff} hours ago`;
    } else if (daydiff < 30) {
      if( daydiff=== 1){
        return `${daydiff} day ago`;
      }
      return `${daydiff} days ago`;
    } else if (monthdiff < 12) {
      if( monthdiff=== 1){
        return `${monthdiff} month ago`;
      }
      return `${monthdiff} months ago`;
    } else {
      if(yeardiff === 1){
        return `${yeardiff} year ago`;
      }
      return `${yeardiff} years ago`;
    }
  }

   // limits the display of content in main page to 20 words.
   function display_post_content_limit80(content){
    let words = content.split(' ');
    return words.length > 80 ? words.slice(0, 80).join(' ') + '...' : content;
  }

  //Given the commentID, find the comment object
  function findCommentObject(commentID){
    for(let commentObject of model.data.comments){
      if(commentID === commentObject.commentID){
        return commentObject;
      }
    }
  }
  //Find the total number of comments that a post has given the post object/comment object
  function findCommentNumber(post){
    if(post.commentIDs.length === 0) return 0;
    else{
      let total = post.commentIDs.length;
      for(let comment of post.commentIDs){
        total += findCommentNumber(findCommentObject(comment));
      }
      return total;
    }
  }

  //POST SORTING FUNCTIONS
  function sortPostsNew(){
    setDisplayedPosts([...displayedPosts].sort((a,b) => b.postedDate - a.postedDate));
  }

  function sortPostsOld(){
    setDisplayedPosts([...displayedPosts].sort((a,b) => a.postedDate - b.postedDate));
  }

  function sortPostsActive(){
    setDisplayedPosts([...displayedPosts].sort((a,b) => findCommentNumber(b) - findCommentNumber(a)));
  }

  //Handles changes to the create-community form, and stores the data into createCommunityData
  function handleCommunityFormChange(e){
    let name = e.target.name;
    let value = e.target.value;

    setCreateCommunityData({...createCommunityData, [name]:value});
  }

  //Handles the submit button for the create-community form
  function handleEngenderCommunity(){
    let invalid = false;
    setCWarning1(null);
    setCWarning2(null);
    setCWarning3(null);
    if(createCommunityData.name === ''){
      setCWarning1(<div className="entry-warning name-warning">*Community name is required.</div>);
      invalid = true;
    }
    if(createCommunityData.description === ''){
      setCWarning2(<div className="entry-warning description-warning">*Community description is required.</div>);
      invalid = true;
    }
    if(createCommunityData.username === ''){
      setCWarning3(<div className="entry-warning username-warning">*Creator username is required.</div>);
      invalid = true;
    }

    if(invalid === false){
      let ID = `community${model.data.communities.length + 1}`;
      let members = [createCommunityData.username];
      let memberCount = 1;
      let posts = [];
      let description = createCommunityData.description;
      let name = createCommunityData.name;
      let dateCreated = new Date();
      
      let communityObject = {
        communityID: ID,
        name: name,
        description: description,
        postIDs: posts,
        startDate: dateCreated,
        members: members,
        memberCount: memberCount,
      };

      model.data.communities.push(communityObject);

      setCommunityList(model.data.communities);
      

      renderNewCommunity(communityObject);
    }
  }


  function RenderPage(){ //Returns the html of the main page depending on currentView
    const headerArgs = {headerTitle, sortSelected, setSortSelected, sortPostsNew, sortPostsOld, sortPostsActive, communityDescription, displayedPosts, currentView, communityMemberCount};
    const communityFormArgs = {handleCommunityFormChange, cwarning1, cwarning2, cwarning3, handleEngenderCommunity};
    if(currentView === 'home' || currentView === 'community'){
      return(
        <div>
        <Header {...headerArgs}/>
        <PostContainer display_posts={display_posts}/>
        </div>
      )
    }
    else if(currentView === 'create-community'){
      return (
        <CommunityForm {...communityFormArgs}/>
      )
    }
    else if (currentView === 'post'){ //post_page_view
      return(post_page_view());

    }else{//create post
     
      return(CreatePostButtonActivate());
    }

  }; 

  function display_posts(){
    return (displayedPosts.map((post)=>{  
      let community = find_community_of_post(post.postID);
      let time_stamp = time_stamp_display(post.postedDate);
      let linkFlair_content = find_linkflair(post.linkFlairID);
      let content_limit = display_post_content_limit80(post.content);
      let postArgs = {setCurrentView, setCurrentPostID, post, community,time_stamp, linkFlair_content,content_limit, findCommentNumber}
      return(
        <Post {...postArgs}/>
      )
    })) 
  }


  function post_page_view(){
    let current_post = undefined;
    model.data.posts.forEach((post)=>{  //find the specific post object wiht ID 
      if(post.postID == currentPostID){
        current_post = post;
      }
    });
    let community = find_community_of_post(current_post.postID);
    let time_stamp = time_stamp_display(current_post.postedDate);
    let linkFlair_content = find_linkflair(current_post.linkFlairID);
    const postContentArgs = {community, time_stamp, current_post, linkFlair_content, findCommentNumber, setCurrentCommentID, setReplying, replying, currentCommentID, display_comment_section, CommentReply};
    return(
      <PostContent {...postContentArgs}/>
    )
  }


  function CommentReply(){
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState('');
  const [commentError, setCommentError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
    const Submit_comment = () => {
    

    // Check for errors
  let invalid = false;

  if (comment === "") {
    setCommentError(true);
    invalid = true;
  } else {
    setCommentError(false);
  }
  
  
  if (username === "") {
    setUsernameError(true);
    invalid = true;
  } else {
    setUsernameError(false);
  }
 
  // All valid
  if (!invalid) {
      let commentid = `comment${model.data.comments.length+1}`;
      let comment_object= 
        {
        commentID:commentid,
        content: comment,
        commentIDs:[],
        commentedBy: username,
        commentedDate: new Date(),
        };
      model.data.comments.push(comment_object);//add the comment to list of comments
      setComments(prevComments => {    
        const updatedComments = prevComments.filter(existingComment => existingComment.commentID !== comment_object.commentID);
        return [...updatedComments, comment_object]; // avoided duplicates
    });
      
      if(currentCommentID ==="0"){//replying to a post
        let comment_target_post = model.data.posts.find(post => post.postID === currentPostID); //obtain the current post's object
        comment_target_post.commentIDs.push(comment_object.commentID);
        
      }else{ //replying to a comment
        let comment_target = model.data.comments.find(comment => comment.commentID === currentCommentID);
        comment_target.commentIDs.push(comment_object.commentID)
        
      }
      // Reset error 
    
      setCommentError(false);
      setUsernameError(false);
      setComment("");
      setUsername("");
      setReplying(false);
    }
  };
   return(
    <div className ="comment-reply-container">
      <textarea
        className="comment-reply-content"
        maxLength="500"
        placeholder="Enter Your Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {commentError && (
        <div className="comment-reply-warning comment-reply-content-warning">
          *Comment content is required.
        </div>
      )}

      <input
        className="comment-reply-username"
        type="text"
        maxLength="50"
        placeholder="Enter Your Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {usernameError && (
        <div className="comment-reply-warning comment-reply-username-warning">
          *Username is required.
        </div>
      )}

      <div className="submit-cancel-container">
        <button
          className="submit-comment-reply-button"
          onClick={Submit_comment}
        >
          Submit Comment
        </button>
        <button
          className="cancel-comment-reply-button"
          onClick={() => {setReplying(false); //cancels everything
            setComment("");
            setUsername("");
          }
          } 
        >
          Cancel
        </button>
      </div>
    </div>
   )
  }

 function CreatePostButtonActivate(){


  const handleDropdown = (type, value) => {
    if (type === 'community') {
      setCommunitySelected(value);
      setCommunityDropdownOpen(false); 
    } else if (type === 'flair') {
      if(value === 'Create LinkFlair'){
        setCreateLinkFlair(true);
        setLinkFlairSelected('Create LinkFlair');
        setlinkflairDropdownOpen(false); 
        setLinkFlairCreated('');
      }else if(value === 'No LinkFlair'){
       setLinkFlairSelected('No LinkFlair');
       setCreateLinkFlair(false);
       setlinkflairDropdownOpen(false); 
       setLinkFlairCreated('');
      }else{
      setLinkFlairSelected(value);
      setlinkflairDropdownOpen(false); 
      setLinkFlairCreated(value);
      setCreateLinkFlair(false);
      }
      
    }
  };

  const submit_post = () => {
    let invalid = false;
    const newWarnings = {
      community: false,
      flair: false,
      title: false,
      content: false,
      username: false,
    };
    
    if (communitySelected === 'Select a community') {
      newWarnings.community = true;
      invalid = true;
    }
    if (linkFlairCreated === '' && createLinkFlair) {
      newWarnings.flair = true;
      invalid = true;
    }
    if (title === '') {
      newWarnings.title = true;
      invalid = true;
    }
    if (content === '') {
      newWarnings.content = true;
      invalid = true;
    }
    if (username ==='') {
      newWarnings.username = true;
      invalid = true;
    }
    setWarnings(newWarnings);

    if (!invalid) {
      const updateLinkFlair = linkFlairCreated;
      if(createLinkFlair){
      let flairID= `lf${model.data.linkFlairs.length+1}`;
            model.data.linkFlairs.push(
              {
                linkFlairID : flairID,
                content : updateLinkFlair,
              }
            )
      }
      let post_linkFlairID = find_linkflair_ID(updateLinkFlair);
      const newPost = {
        postID: `p${model.data.posts.length + 1}`,
        title: title,
        content: content,
        linkFlairID: post_linkFlairID,
        postedBy: username,
        postedDate: new Date(),
        commentIDs: [],
        views: 0,
      };

      // Add new post to the posts array
      model.data.posts.push(newPost);

      // Add the post ID to the community it belongs to
      const communityToUpdate = model.data.communities.find((community) => community.name === communitySelected);
      communityToUpdate.postIDs.push(newPost.postID);

      // Reset  and rerender homepage
      setCommunitySelected('Select a community');
      setLinkFlairSelected('Select a linkFlair');
      setTitle('');
      setContent('');
      setUsername('');
      renderHomePage();
      setCreateLinkFlair(false);
      setCommunityDropdownOpen(false);
      setlinkflairDropdownOpen(false);
      setWarnings({   
        community: false,
        flair: false,
        title: false,
        content: false,
        username: false,
      });
    }
    
  }
  const postFormArgs = {setCommunityDropdownOpen, communitySelected, warnings, communityDropdownOpen, model, handleDropdown, setTitle, setlinkflairDropdownOpen,linkFlairSelected, createLinkFlair,linkflairDropdownOpen, title, linkFlairCreated, setLinkFlairCreated, content, setContent, username, setUsername, submit_post};
  return(
    <PostForm {...postFormArgs}/>
  )
 }



  function display_comment_section(post) {
    function display_comment_recurse(comment, depth) { // param comment = comment object
      let time_stamp = time_stamp_display(comment.commentedDate);
      let replies = comments.filter(each_reply => comment.commentIDs.includes(each_reply.commentID)); // list of comment objects
      const commentArgs = {comment,time_stamp, setCurrentCommentID, setReplying, replying, currentCommentID, CommentReply, replies, display_comment_recurse, depth}
      return (
        <Comment {...commentArgs}/>
      );
      
    }
    let depth_0_comments = comments.filter(comment_object => post.commentIDs.includes(comment_object.commentID));
 
    return depth_0_comments.map(each_comment => display_comment_recurse(each_comment, 0));
    
  }

 

  //Function that returns the html for the community list.
  function displayCommunityList(){
    return (communityList.map((community)=>{
      if(currentView=== 'home'){
        return (
        <div className= {`${(currentView=== 'community' && currentCommunity.communityID === community.communityID)? "community-link-click":"community-link-red" }`} data-id={community.communityID} data-name={community.name} onClick={renderCommunityPage}>{community.name}</div>
        )
      }else{
        return (
          <div className= {`${(currentView=== 'community' && currentCommunity.communityID === community.communityID)? "community-link-click":"community-link-gray" }`} data-id={community.communityID} data-name={community.name} onClick={renderCommunityPage}>{community.name}</div>
          )
      }
    }));
  }

  //Function the renders the communityPage when clicking on the community links
  function renderCommunityPage(e){
    setCurrentView('community');
    setSortSelected('new');
    setHeaderTitle("r/" + e.currentTarget.dataset.name);
    let communityObject = findCommunityGivenID(e.currentTarget.dataset.id);
    setCurrentCommunity(communityObject);
    setCommunityMemberCount(communityObject.memberCount);
    setCommunityDescription(
      <div>
        <div className="community-description">{communityObject.description}
        </div>
        <div className="creation-date">Created {time_stamp_display(communityObject.startDate)}</div>
      </div>
    )
      
    const communityPosts = [];
    const communityID = e.currentTarget.dataset.id;
    for(let community of model.data.communities){
      if(community.communityID === communityID){
        for(let postID of community.postIDs){
          communityPosts.push(findPostGivenID(postID));
        }
      }
    }
    communityPosts.sort((a,b)=> b.postedDate - a.postedDate);
    setDisplayedPosts(communityPosts);
    RenderPage();
  }

  //Function that renders a newly created community
  function renderNewCommunity(communityObject){
    setCurrentView('community');
    setSortSelected('new');
    setHeaderTitle("r/" + communityObject.name);
    setCommunityDescription(
      <div>
        <div className="community-description">{communityObject.description}
        </div>
        <div className="creation-date">Created {time_stamp_display(communityObject.startDate)}</div>
      </div>
    )
      
    const communityPosts = [];

    setDisplayedPosts(communityPosts);
  }

  //Function that returns the post Object given the postID
  function findPostGivenID(postID){
    for(let post of model.data.posts){
      if(post.postID === postID){
        return post;
      }
    }
    return null;
  }

  //Function that return the communityObject given the communityID
  function findCommunityGivenID(communityID){
    for(let community of model.data.communities){
      if(community.communityID === communityID){
        return community;
      }
    }
    return null;
  }

  //Function that will handle what happens when the user searches something up in the search bar
  function handleSearch(e){
    if(searchInput!="" && e.key==='Enter'){
      renderHomePage();
      let searchArray = searchInput.toUpperCase().split(' ');
      let postObjectsArray = [];
      searchArray.forEach((word)=>{
        for(let post of model.data.posts){
          if(post.title.toUpperCase().includes(word) && !postObjectsArray.includes(post)){
            postObjectsArray.push(post);
          }
          else if(post.content.toUpperCase().includes(word) && !postObjectsArray.includes(post)){
            postObjectsArray.push(post);
          }
          else {
            for(let commentID of post.commentIDs){
              if(commentContains(commentID, word) && !postObjectsArray.includes(post)){
                postObjectsArray.push(post);
              }
            }
          }
        }
      })
      postObjectsArray.sort((a,b)=> b.postedDate - a.postedDate);
      setDisplayedPosts(postObjectsArray);
      if(postObjectsArray.length===0){
        setHeaderTitle('No results for: "' + searchInput + '"')
      }
      else{
        setHeaderTitle('Results for: "' + searchInput + '"')
      }

    }
  }

  function updateSearchInput(e){
    setSearchInput(e.target.value);
  }

  function commentContains(commentID, word){
    let commentObject = findCommentObject(commentID);
    if(commentObject.content.toUpperCase().includes(word)){
      return true;
    }
    else{
      for(let subCommentID of commentObject.commentIDs){
        let subCommentObject = findCommentObject(subCommentID);
        if(subCommentObject.content.toUpperCase().includes(word)){
          return true;
        }
      }
      return false;
    }
  }

  //Given the ID of a comment, return the actual comment Object
  function findCommentObject(commentID){
    for(let comment of model.data.comments){
      if(comment.commentID === commentID){
        return comment;
      }
    }
  } 

  //Renders the create community page
  function renderCreateCommunity(){
    setCurrentView('create-community');
  }


  return (
    <div>
      <Banner currentView={currentView} setCurrentView={setCurrentView} updateSearchInput={updateSearchInput} handleSearch={handleSearch} renderHomePage={renderHomePage}/>

      <NavigationBar renderHomePage={renderHomePage} currentView={currentView} renderCreateCommunity={renderCreateCommunity} displayCommunityList={displayCommunityList}/>
      
      
      <div className="main">
        {RenderPage()}
      </div>
      
    </div>
  );
}

