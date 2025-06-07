const UserLoader = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="user-card skeleton">
          <div>
            <img className="profile-pic loader-img skeleton-element" alt="" />
          </div>
          <div className="small-text-div">
            <div className="small-card-p loader-p skeleton-element"></div>
            <div className="small-card-p loader-p skeleton-element"></div>
            <div className="small-card-p loader-p skeleton-element"></div>
          </div>
        </div>
      ))}
    </>
  )
}

export default UserLoader
