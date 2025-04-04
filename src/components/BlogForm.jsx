const BlogForm = (props) => {
    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={props.addBlog}>
                <div>
                    title:<input value={props.title}
                        onChange={props.handleTitleChange} />
                </div>
                <div>
                    author:<input value={props.author}
                        onChange={props.handleAuthorChange}
                    />
                </div>
                <div>
                    url:<input
                        value={props.url}
                        onChange={props.handleUrlChange}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>


    )
}



export default BlogForm