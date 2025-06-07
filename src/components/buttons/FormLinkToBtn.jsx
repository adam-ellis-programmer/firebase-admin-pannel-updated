import { Link } from 'react-router-dom'

const FormLinkToBtn = ({ link, text }) => {
  return (
    <Link to={link} className="form-sub-link">
     {text}
    </Link>
  )
}

export default FormLinkToBtn
