function AdminPost({post, }) {
    const postGuessHTML = (
        <div className="post">
            <h1>{post.account_alias}</h1>
            <h2>{post.username}</h2>
            <div className="video">
                <video controls>
                    <source src={post.video} type='video/mp4'/>               
                </video>
            </div>
            <h3>{post.question}</h3>
            <div className="post-answers">
                <div className={`answer-post-guess`}>
                    <p>{post.answer1}</p>
                </div>
                <div className={`answer-post-guess`}>
                    <p>{post.answer2}</p>
                </div>   
            </div>
        </div>
    )

    return postGuessHTML
}

export default AdminPost