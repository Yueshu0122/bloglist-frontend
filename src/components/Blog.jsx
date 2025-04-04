import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogs, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const [errorMsg, setErrorMsg] = useState(null)


  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.update(blog.id, { ...blog, likes: likes + 1 })
      setLikes(updatedBlog.likes) // 更新本地状态
      if (updateBlogs) { // 这里检查是否存在updateBlogs回调
        updateBlogs(updatedBlog) // 如果提供了更新父组件列表的回调，则调用它
      }
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        const response = await blogService.remove(blog.id)
        if (removeBlog) { // 这里检查是否存在updateBlogs回调
          removeBlog(blog.id)// 如果提供了更新父组件列表的回调，则调用它
        }
      } catch (exception) {
        setErrorMsg(exception.response.data.error)
        setTimeout(() => {
          setErrorMsg(null)
        }, 5000)
      }
    }
  }


  return (
    <div style={blogStyle}>
      <div>
        {blog.title}<button onClick={blogVisibility} style={showWhenVisible}>hide</button><button onClick={blogVisibility} style={hideWhenVisible}>view</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.url}
        </div>
        <div>
          likes {likes}<button onClick={handleLike}>like</button>
        </div>
        <div>
          {blog.author}
        </div>
        <div style={{ color: 'red' }}>{errorMsg}</div>
        <button onClick={handleRemove}>remove</button>
      </div>
    </div>
  )
}

export default Blog