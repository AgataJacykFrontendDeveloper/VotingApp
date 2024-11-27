import { useState, useContext } from "react";
import { doc, setDoc, addDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AlertContext from "../context/AlertProvider";
import Form from "react-bootstrap/Form";

const createSlug = (title) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9 ]/g, "") // Remove non alphanumeric characters
    .replace(/\s+/g, "-"); // Replace whitespaces with hyphen
};

const AdminCreatePoll = () => {
  const { addAlert } = useContext(AlertContext);
  const [songs, setSongs] = useState([]);
  const [draggedSong, setDraggedSong] = useState(null);
  const [validated, setValidated] = useState(false);

  const handleDragStart = (index) => {
    setDraggedSong(index);
  };

  const handleDrop = (index) => {
    const updatedSongs = [...songs];
    const [removed] = updatedSongs.splice(draggedSong, 1);
    updatedSongs.splice(index, 0, removed);
    setSongs(updatedSongs);
    setDraggedSong(null);
  };

  const handleSongAdd = () => {
    setSongs([
      ...songs,
      { artist: "", genre: "", title: "", url: "", votes: 0 },
    ]);
  };

  const handleSongDelete = (i) => {
    const updatedSongs = songs.filter((_, index) => index !== i);
    setSongs(updatedSongs);
  };

  const handleSongChange = (e, i) => {
    const { name, value } = e.target;
    const updatedSongs = [...songs];
    updatedSongs[i][name] = value;
    setSongs(updatedSongs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (e.target.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const formData = new FormData(e.target);
    const form = {
      title: formData.get("title"),
      type: formData.get("type"),
      start_at: new Date(formData.get("start_at")),
      end_at: new Date(formData.get("end_at")),
      anonymousVoting: formData.get("anonymousVoting") === "on",
      published: formData.get("published") === "on",
    };

    if (form.title.length < 3) {
      return addAlert("Nazwa głosowania musi zawierać co najmniej 3 znaki.");
    }

    if (form.start_at >= form.end_at) {
      return addAlert(
        "Data zakończenia nie może być wcześniej niż data rozpoczęcia"
      );
    }

    if (songs.length === 0) {
      return addAlert("Musisz dodać co najmniej jeden utwór.");
    }

    const slug = createSlug(form.title);

    try {
      // TODO: Change later to transaction with batched writes
      const docRef = doc(db, "polls", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return addAlert("Głosowanie o takiej nazwie już istnieje.");
      } else {
        await setDoc(docRef, form);

        const songsRef = collection(docRef, "songs");
        for (let song of songs) {
          await addDoc(songsRef, song);
        }
        e.target.reset();
        setSongs([]);
        setValidated(false);
        return addAlert("Głosowanie zostało utworzone.", "success");
      }
    } catch (error) {
      console.error("Error creating document: ", error);
      return addAlert(
        "Wystąpił błąd podczas tworzenia głosowania, spróbuj ponownie."
      );
    }
  };

  return (
    <div>
      <h2>Nowa lista utworów</h2>
      <Form
        onSubmit={handleSubmit}
        noValidate
        validated={validated}
        className="d-flex flex-column gap-3 container-sm container m-0"
      >
        <Form.Group>
          <Form.Label htmlFor="title">Nazwa</Form.Label>
          <Form.Control type="text" id="title" name="title" required />
          <Form.Control.Feedback type="invalid">
            Proszę podaj nazwe głosowania.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="type">Typ głosowania</Form.Label>
          <Form.Select defaultValue="" name="type" id="type" required>
            <option value="" disabled hidden>
              Wybierz typ głosowania
            </option>
            <option value="weekly">Tygodnia</option>
            <option value="monthly">Miesiąca</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Proszę podaj typ głosowania.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="start_at">Data rozpoczęcia</Form.Label>
          <Form.Control
            type="datetime-local"
            id="start_at"
            name="start_at"
            required
          />
          <Form.Control.Feedback type="invalid">
            Proszę prawidłową date rozpoczęcia głosowania.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="end_at">Data zakończenia</Form.Label>
          <Form.Control
            type="datetime-local"
            id="end_at"
            name="end_at"
            required
          />
          <Form.Control.Feedback type="invalid">
            Proszę prawidłową date zakończenia głosowania.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            id="anonymousVoting"
            name="anonymousVoting"
            label="Głosowanie anonimowe"
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            id="published"
            name="published"
            label="Opublikowana"
          />
        </Form.Group>
        <div>
          <h4 className="ml-n2 mt-2">Lista utworów</h4>
          {songs.map((song, i) => (
            <div
              key={i}
              className="d-flex flex-column gap-1 mb-3"
              draggable
              onDragStart={() => handleDragStart(i)}
              onDrop={() => handleDrop(i)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="d-flex flex-row gap-2">
                <h5 className="fw-semibold my-auto">Utwór {i + 1}</h5>
                <button
                  className="border-0 p-1 bg-danger rounded h-100"
                  onClick={() => handleSongDelete(i)}
                >
                  <svg
                    className="text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                </button>
              </div>
              <Form.Group>
                <Form.Label htmlFor={`song-artist-${i}`}>Artysta</Form.Label>
                <Form.Control
                  type="text"
                  id={`song-artist-${i}`}
                  name="artist"
                  value={song.artist}
                  onChange={(e) => handleSongChange(e, i)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Proszę podaj nazwe artysty.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor={`song-genre-${i}`}>Gatunek</Form.Label>
                <Form.Control
                  type="text"
                  id={`song-genre-${i}`}
                  name="genre"
                  value={song.genre}
                  onChange={(e) => handleSongChange(e, i)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Proszę podaj nazwe gatunku.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor={`song-title-${i}`}>Tytuł</Form.Label>
                <Form.Control
                  type="text"
                  id={`song-title-${i}`}
                  name="title"
                  value={song.title}
                  onChange={(e) => handleSongChange(e, i)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Proszę podaj nazwe artysty.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor={`song-url-${i}`}>URL</Form.Label>
                <Form.Control
                  type="text"
                  id={`song-url-${i}`}
                  name="url"
                  value={song.url}
                  onChange={(e) => handleSongChange(e, i)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Proszę podaj nazwe artysty.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          ))}
          <button
            type="button"
            onClick={handleSongAdd}
            className="btn-cyan w-fit"
          >
            Dodaj utwór
          </button>
        </div>

        <button type="submit" className="btn-cyan w-fit">
          Utwórz głosowanie
        </button>
      </Form>
    </div>
  );
};

export default AdminCreatePoll;
