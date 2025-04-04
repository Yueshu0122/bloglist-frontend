import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()


  // 处理标题输入框的变化
  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  // 处理作者输入框的变化
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  // 处理URL输入框的变化
  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  // 处理URL输入框的变化
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const updateBlogList = (updatedBlog) => {
    setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
  }

  const removeBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }


  // 提交表单时的处理函数
  const addBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url,
    }

    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs => blogs.concat(blog)) // 使用函数式更新避免潜在的状态不一致问题
      setMessage(`A new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      blogFormRef.current.toggleVisibility()

      // 清空表单
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.error('Error adding blog:', error)
      setMessage('Failed to add blog, please try again.')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])



  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} type='error' />
        <LoginForm handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} type='notice' />
      <p>{user.username} logged in<button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm
          addBlog={addBlog}
          title={title}
          author={author}
          url={url}
          handleTitleChange={handleTitleChange}
          handleAuthorChange={handleAuthorChange}
          handleUrlChange={handleUrlChange}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlogs={updateBlogList} removeBlog={removeBlog} />
      )}
    </div>
  )
}

export default App
