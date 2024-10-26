export function Header({headerTitle, sortSelected, setSortSelected, sortPostsNew, sortPostsOld, sortPostsActive, communityDescription, displayedPosts, currentView, communityMemberCount}){
  return(
    <div>
      <div className="sort-menu">
        <h3 className="all-post-header">{headerTitle}</h3>
        <button className={`newest-button sort-button ${sortSelected === 'new' ? 'selected' : ''}`} 
        onClick={()=>{
          setSortSelected('new');
          sortPostsNew();
        }
          }>Newest</button>
        <button className={`oldest-button sort-button ${sortSelected === 'old' ? 'selected' : ''}`} onClick={
          ()=>{
            setSortSelected('old');
            sortPostsOld();
          }
        }>Oldest</button>
        <button className={`active-button sort-button ${sortSelected === 'active' ? 'selected' : ''}`} onClick={
          ()=>{
            setSortSelected('active');
            sortPostsActive();
          }
        }>Active</button>
        {communityDescription}
        <div className="community-member-post-count">
          <div className="post-count-display">{displayedPosts.length} Posts</div>
          {currentView=== 'community'&& (
            <div className ="member-count-display">{communityMemberCount} members</div>
          )}
        </div>
      </div>
    </div>
  )
}

export function PostContainer({display_posts}){
  return (
    <div className="posts-container">
      {display_posts()}
    </div>
  )
}

export function CommunityForm({handleCommunityFormChange, cwarning1, cwarning2, cwarning3, handleEngenderCommunity}){
  return (
    <div>
      <div className="create-community-form">
        <h2 className="create-community-heading">Tell us about your community</h2>
        <p className="create-community-note">A name and description help people understand what your community is about</p>
        <p>Community Name<span className="red-asterisk">*</span></p>
        <input name = "name"className="community-entry name-entry" type="text" maxLength="100" onChange={handleCommunityFormChange}/>
        {cwarning1}
        <p>Description<span className="red-asterisk">*</span></p>
        <textarea onChange={handleCommunityFormChange} name="description" className="community-entry description-entry" type="text" maxLength="500"></textarea>
        {cwarning2}
        <p>Username<span className="red-asterisk">*</span></p>
        <input onChange={handleCommunityFormChange} name="username" className="community-entry creator-username-entry" type="text"/>
        {cwarning3}
        <button onClick={handleEngenderCommunity} className="submit-community-button">Engender Community</button>
      </div>
    </div>
  )
}

export function Post({setCurrentView, setCurrentPostID, post, community,time_stamp, linkFlair_content,content_limit, findCommentNumber}){
  return (
    <div>
      <div className="posts" data-postid={post.postID} onClick={() => {setCurrentView('post');
        setCurrentPostID(post.postID);
        post.views +=1;
      }}>
        <div className="post-community-author-time"> 
          <div className="post-community">r/{community.name}</div>
          <div className="post-author"> posted by {post.postedBy}</div>
          <div className="post-time"> {time_stamp}</div>
        </div>
        <div className="post-title"> {post.title}</div>
        <button className="post-flair"> {linkFlair_content}</button>
        <div className="post-content"> {content_limit}</div>
        <div className="views-and-comment-count">
          <button className = "views-count"> views: {post.views} </button>
          <button className = "comment-count">  comments: {findCommentNumber(post)} </button>
        </div>
      </div>
      <hr className="delimiter-posts"></hr>
    </div>
  )
}

export function PostContent({community, time_stamp, current_post, linkFlair_content, findCommentNumber, setCurrentCommentID, setReplying, replying, currentCommentID, display_comment_section, CommentReply}){
  return(
    <div className="post-pageview">
      <div className="post-community-time"> 
        <div className="post-community">r/{community.name}</div>
        <div className="post-time"> {time_stamp}</div>
      </div>
      <div className="author-pageview"> posted by {current_post.postedBy}</div>
      <div className="post-title-pageview"> {current_post.title}</div>
      <button className="post-flair"> {linkFlair_content}</button>
      <div className="post-content-pageview"> {current_post.content}</div>
      <div className="views-and-comment-count">
          <button className = "views-count"> views: {current_post.views} </button>
          <button className = "comment-count">  comments: {findCommentNumber(current_post)} </button>
      </div>
      <button className="add-comment-reply add-comment-button" onClick={() => {setCurrentCommentID("0"); //used 0 to denote replying to post
          setReplying(!replying);
          
        }}>Add comment</button>          
      {replying && currentCommentID === "0" && <CommentReply />}
      <hr/>
      <hr className="delimiter-pageview"/>
      <div className="comment-section"> {display_comment_section(current_post)}</div> 
    </div>
  )
}

export function PostForm({setCommunityDropdownOpen, communitySelected, warnings, communityDropdownOpen, model, handleDropdown, setTitle, setlinkflairDropdownOpen,linkFlairSelected, createLinkFlair,linkflairDropdownOpen, title, linkFlairCreated, setLinkFlairCreated, content, setContent, username, setUsername, submit_post}){
  return(
  <div className="create-post-page">
      <h2 className="create-post-heading">Create Your Post</h2>

      <p>Post Community<span className="red-asterisk">*</span></p>
      <div className="dropdown">
        <div className="select" onClick={() => setCommunityDropdownOpen((prev) => !prev)}> 
          <span className="selected-createPost selected-community">{communitySelected}</span>
          <div className="caret"></div>
        </div>
        <div className={`post-entry-warning post-community-warning ${warnings.community ? 'reveal' : ''}`}>
          *Post Community is required.
        </div>
        {communityDropdownOpen && (
          <ul className="dropdown-menu dropdown-menu-community">
            {model.data.communities.map((community) => (
              <li key={community.name} onClick={() => handleDropdown('community', community.name)}>
                {community.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p>Post Title<span className="red-asterisk">*</span></p>
      <input
        className="post-entry post-title-entry"
        type="text"
        value={title}
        maxLength="100"
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className={`post-entry-warning post-title-warning ${warnings.title ? 'reveal' : ''}`}>*Post Title is required.</div>

      <p>Post Link Flair</p>
      <div className="dropdown">
        <div className="select" onClick={() => setlinkflairDropdownOpen((prev) => !prev)}>
          <span className="selected-createPost selected-flair">{linkFlairSelected}</span>
          <div className="caret"></div>
        </div>
        {linkflairDropdownOpen && (
          <ul className="dropdown-menu dropdown-menu-flair">
            <li onClick={() => handleDropdown('flair', 'Create LinkFlair')}>Create LinkFlair</li>
            <li onClick={() => handleDropdown('flair', 'No LinkFlair')}>No LinkFlair</li>
            {model.data.linkFlairs.map((flair) => (
              <li key={flair.linkFlairID} onClick={() => handleDropdown('flair', flair.content)}>
                {flair.content}
              </li>
            ))}
          </ul>
        )}
      </div>

      {createLinkFlair === true && (
        <div className="create-link-flair">
          <input
            className="post-entry post-linkFlair-entry"
            type="text"
            placeholder="Enter Link Flair"
            maxLength="30"
            value={linkFlairCreated}
            onChange={(e) => setLinkFlairCreated(e.target.value)}
          />
          <div className={`post-entry-warning post-flair-warning ${warnings.flair ? 'reveal' : ''}`}>
            *You chose to create Link Flair, please enter one.
          </div>
        </div>
      )}

      <p>Post Content<span className="red-asterisk">*</span></p>
      <textarea
        className="post-entry post-content-entry"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className={`post-entry-warning post-content-warning ${warnings.content ? 'reveal' : ''}`}>*Post Content is required.</div>

      <p>Username<span className="red-asterisk">*</span></p>
      <input
        className="post-entry post-username-entry"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className={`post-entry-warning post-username-warning ${warnings.username ? 'reveal' : ''}`}>*Creator username is required.</div>

      <button className="submit-post-button" onClick={submit_post}>Release Post</button>
    </div>
  )
}

export function Comment({comment,time_stamp, setCurrentCommentID, setReplying, replying, currentCommentID, CommentReply, replies, display_comment_recurse, depth}){
  return(
    <div className="comment" style={{ marginLeft: depth * 30 + 'px' }}>
      <div className="comment-box">
        <div className="comment-author-time"> 
          <div className="comment-author">{comment.commentedBy}</div>
          <div className="comment-time">{time_stamp}</div>
        </div>
        <div className="comment-content">{comment.content}</div>
        <button className="add-comment-reply reply-button" onClick={() => {setCurrentCommentID(comment.commentID); //used 0 to denote replying to post
        setReplying(!replying);
      }}>reply</button>
      {replying && currentCommentID === comment.commentID && <CommentReply />}
      </div>
      <hr className="delimiter-comment" style={{ marginLeft: depth * 30 + 'px' }} />
      {replies.map(reply => display_comment_recurse(reply, depth + 1))}
    </div>
  )
}