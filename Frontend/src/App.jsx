import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {

  const [notes, setNotes] = useState([]);

  const fetchNotes = () => {

    axios.get('http://localhost:3000/api/notes')
      .then((res) => {
        setNotes(res.data.notes)
      })
  }


  function submitHandler(e) {
    e.preventDefault();

    const { title, description } = e.target.elements;

    axios.post('http://localhost:3000/api/notes', {
      title: title.value,
      description: description.value
    }).then((res) => {
      console.log(res);
      fetchNotes()
    })


    title.value = '';
    description.value = ''

  }

  function deleteHandler(id) {

    axios.delete(`http://localhost:3000/api/notes/${id}`)
      .then(res => {
        console.log(res);
      })

    fetchNotes()
  }

  function editHandler(id) {
    let modal = document.querySelector('.modal');
    modal.style.display = 'block'

    let back = document.querySelector('.back');
    back.addEventListener('click', () => {
      modal.style.display = 'none'
    })

    let edit = document.querySelector('.edit');
    let form = edit.querySelector('form');


    form.addEventListener('submit', (e) => {
      e.preventDefault()
      // console.log(e);


      let { editTitle, editDescription } = e.target.elements
      // console.log(editTitle, editDescription);

      axios.patch(`http://localhost:3000/api/notes/${id}`, {
        title: editTitle.value,
        description: editDescription.value
      })
        .then((res) => {
          // console.log(res);

          editTitle.value = '';
          editDescription.value = '';

          modal.style.display = 'none'
          fetchNotes()
        })

    })
  }

  useEffect(() => {
    fetchNotes()
  }, [])



  return (
    <div className="main">
      <div className="fm">
        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h2>Create Note</h2>
          <div className="in">
            <input name='title' type="text" required placeholder='Title' />
            <input name='description' type="text" required placeholder='Descrption' />
          </div>

          <button>ADD</button>
        </form>
      </div>
      <div className="notes">
        {notes.map((elem, idx) => {
          return <div key={idx} className="note">
            <div className="content">
              <h4>{elem.title}</h4>
              <p>{elem.description}</p>
            </div>

            <div className="btns">
              <button onClick={() => {
                deleteHandler(elem._id)
              }}>delete</button>
              <button onClick={() => {
                editHandler(elem._id)
              }}>edit</button>
            </div>
          </div>
        })}
      </div>
      <div className="modal">
        <div className="edit">
          <form>
            <input type="text" name='editTitle' placeholder='title(required)' required />
            <input type="text" name='editDescription' placeholder='description' />
            <button>Save Changes</button>
          </form>
        </div>
        <div className="back"></div>
      </div>
    </div>
  )
}

export default App
