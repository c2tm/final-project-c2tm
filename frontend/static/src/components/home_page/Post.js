function Post({post, accountInfo}) {

    let displayHTML;

    const UsersPostHTML = (
        <div className="post" key={post.id}>
            <h1>{post.account_alias}</h1>
            <h2>{post.username}</h2>
            <div className="video">
                <video controls>
                    <source src={post.video} type='video/mp4'/>               
                </video>
            </div>
            <p>{`${post.likes} Likes`}</p>
        </div>
    )

    const preGuessHTML = (
        <div className="post" key={post.id}>
            <h1>{post.account_alias}</h1>
            <h2>{post.username}</h2>
            <div className="thumbnail">
                <img src={post.thumbnail} alt='video-thumbnail'/>
            </div>
            
            <p>{`${post.likes} Likes`}</p>
            <h3>{post.question}</h3>
            <div className="post-answers">
                <div className="answer">
                    <p>{post.answer1}</p>
                </div>
                <div className="answer">
                    <p>{post.answer2}</p>
                </div>   
            </div>
        </div>
    )

    if (post.user === accountInfo.user) {
        return UsersPostHTML
    }
    return preGuessHTML
}

export default Post