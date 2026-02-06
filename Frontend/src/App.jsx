import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {

  const colors = [
    {
      color1: '#e54050',
      color2: '#fb6675'
    },
    {
      color1: '#E9573F',
      color2: '#fd765b'
    },
    {
      color1: '#fcb932',
      color2: '#fdca49'
    },
    {
      color1: '#8CC151',
      color2: '#A0D468'
    },
    {
      color1: '#36BC9B',
      color2: '#48CFAD'
    },
    {
      color1: '#3BAEDA',
      color2: '#50C0E8'
    },
    {
      color1: '#4B89DC',
      color2: '#5D9CEC'
    },
    {
      color1: '#967BDC',
      color2: '#AC92ED'
    },
    {
      color1: '#D870AD',
      color2: '#EC87BF'
    }
  ]

  const [notes, setNotes] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    description: ''
  });



  const fetchNotes = () => {

    axios.get('https://createcards.onrender.com/api/notes')
      .then(res => {
        console.log("API response:", res.data)
        setNotes(res.data.notes || [])
      })
      .catch(err => {
        console.error("Fetch failed:", err)
        setNotes([])
      })
  }


  function submitHandler(e) {
    e.preventDefault();

    const { title, description } = e.target.elements;

    axios.post('https://createcards.onrender.com/api/notes', {
      title: title.value,
      description: description.value
    }).then((res) => {
      console.log(res);
      fetchNotes()
      console.log(notes);

    })


    title.value = '';
    description.value = ''

  }

  function deleteHandler(id) {

    axios.delete(`https://createcards.onrender.com/api/notes/${id}`)
      .then(() => fetchNotes())
  }

  function editHandler(note) {
    setEditId(note._id);
    setEditData({
      title: note.title,
      description: note.description
    });
    setIsModalOpen(true);
  }


  function createNote() {
    let fm = document.querySelector('.fm');

    fm.style.position = 'relative';
    fm.style.left = '0'
  }

  function removeNote() {
    let fm = document.querySelector('.fm');

    fm.style.position = 'absolute';
    fm.style.left = '-50%'
  }

  function updateNote(e) {
    e.preventDefault();

    axios.patch(
      `https://createcards.onrender.com/api/notes/${editId}`,
      editData
    ).then(() => {
      fetchNotes();
      setIsModalOpen(false);
      setEditId(null);
    });
  }



  useEffect(() => {
    fetchNotes()
  }, [])



  return (
    <div className="main">
      <i onClick={() => {
        createNote()
      }} className="ri-add-large-fill make"></i>
      <div className="fm">
        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h2>Create Note</h2>
          <div className="in">
            <input name='title' type="text" required placeholder='Title' />
            <input name='description' type="text" required placeholder='Descrption' />
          </div>
          <i onClick={removeNote} class="ri-close-circle-line"></i>
          <button>ADD</button>
        </form>
      </div>
      <div className="notes">
        {notes?.map((elem, idx) => {
          return <div key={idx} className="note">
            <div className="td">
              <div className="content">
                <h4>{elem.title}</h4>
                <p>{elem.description}</p>
              </div>

              <div className="btns">
                <button onClick={() => {
                  deleteHandler(elem._id)
                }}>delete <i class="ri-delete-bin-5-line"></i></button>
                <button onClick={() => {
                  editHandler(elem)
                }}>edit <i class="ri-edit-2-line"></i></button>
              </div>
            </div>
            <div className="num" style={{ backgroundColor: `${colors[idx % colors.length].color1}` }}>
              <h5>{idx + 1}</h5>
              <div className="dn" style={{ backgroundColor: `${colors[idx % colors.length].color2}` }}></div>
            </div>
          </div>
        })}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="edit">
            <form onSubmit={updateNote} autoComplete="off">
              <h2>Edit Note</h2>

              <input
                type="text"
                value={editData.title}
                onChange={e => setEditData({
                  ...editData,
                  title: e.target.value
                })}
                spellCheck={false}
                required
              />

              <input
                type="text"
                value={editData.description}
                onChange={e => setEditData({
                  ...editData,
                  description: e.target.value
                })}
                spellCheck={false}
              />

              <button>Save Changes</button>
            </form>
          </div>

          <div
            className="back"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
      )}

    </div>
  )
}

export default App
