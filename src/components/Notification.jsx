const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const notificationClassName = type === 'error' ? 'error' : 'notice'

  return (
    <div className={notificationClassName}>
      {message}
    </div>
  )
}

export default Notification