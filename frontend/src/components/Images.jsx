import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Spinner, Modal } from 'react-bootstrap'; // <-- Aggiunto Modal qui
import API from '../API/API.mjs';
import AppNavbar from './AppNavbar.jsx';

// Aggiunta la prop onImageClick
function ImageCard({ image, onVote, voting, alreadyVoted, onImageClick }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={image.url} 
        alt={image.titolo} 
        // Aggiunto cursor: 'pointer' per far capire che è cliccabile e l'evento onClick
        style={{ objectFit: 'cover', height: 200, cursor: 'pointer' }} 
        onClick={() => onImageClick(image)}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-5">{image.titolo || `Immagine #${image.id}`}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Autore: {image.autore || image.name || 'Sconosciuto'}</Card.Subtitle>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">Voti: {image.voti ?? 0}</small>
          <Button 
            variant={alreadyVoted ? "warning" : "danger"} 
            onClick={() => onVote(image.id)} 
            disabled={voting}
          >
            {voting ? 'Votando...' : (alreadyVoted ? 'Annulla voto' : 'Vota')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

function ImagesList(props) {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);
  const [votesRemaining, setVotesRemaining] = useState(3);

  // --- NUOVI STATI PER IL MODAL ---
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
    fetchVotesRemaining();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchImages() {
    setLoading(true);
    try {
      const data = await API.getImages();
      setImages(data);
    } catch (err) {
      console.error('Errore fetch immagini:', err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchVotesRemaining() {
    try {
      const data = await API.getVotesRemaining();
      setVotesRemaining(data.votesRemaining);
    } catch (err) {
      console.error('Errore nel recuperare i voti rimasti:', err);
    }
  }

  async function handleVote(id) {
    if (votingId) return;
    setVotingId(id);
    try {
      const response = await API.voteImage(id);

      if (response.action === 'added') {
        setImages(prev => prev.map(img => 
          img.id === id 
            ? { ...img, voti: (img.voti ?? 0) + 1, voted: true } 
            : img
        ));
      } else if (response.action === 'removed') {
        setImages(prev => prev.map(img => 
          img.id === id 
            ? { ...img, voti: Math.max(0, (img.voti ?? 0) - 1), voted: false } 
            : img
        ));
      }
      
      await fetchVotesRemaining();
    } catch (err) {
      console.error('Errore durante il voto:', err);
      alert(err.message || 'Impossibile registrare il voto. Assicurati di essere autenticato.');
    } finally {
      setVotingId(null);
    }
  }

  // --- FUNZIONI PER GESTIRE L'APERTURA E CHIUSURA DEL MODAL ---
  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return <>
    <AppNavbar loggedin={props.loggedin} handleLogout={props.handleLogout}/> 
    
    <div className="container mt-5 py-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold text-dark">Vota le tue immagini preferite</h2>
        <div className="alert alert-info mb-0 shadow-sm">
          Voti rimasti: <strong>{votesRemaining} / 3</strong>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>
      ) : images.length === 0 ? (
        <p>Nessuna immagine disponibile.</p>
      ) : (
        <>
          {votesRemaining === 0 && (
            <div className="alert alert-warning" role="alert">
              Hai raggiunto il massimo di 3 voti. Puoi annullare un voto per votare un'altra foto.
            </div>
          )}
          <Row xs={1} sm={2} md={3} lg={4} className="g-3">
            {images.map(img => (
              <Col key={img.id}>
                {/* Passiamo la funzione handleOpenModal alla prop onImageClick */}
                <ImageCard 
                  image={img} 
                  onVote={handleVote} 
                  voting={votingId === img.id} 
                  alreadyVoted={img.voted} 
                  onImageClick={handleOpenModal} 
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>

    {/* --- COMPONENTE MODAL PER L'IMMAGINE INGRANDITA --- */}
    <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedImage?.titolo || 'Dettaglio immagine'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center bg-light">
        {selectedImage && (
          <img 
            src={selectedImage.url} 
            alt={selectedImage.titolo} 
            className="img-fluid rounded shadow" 
            style={{ maxHeight: '80vh', objectFit: 'contain' }} 
          />
        )}
      </Modal.Body>
    </Modal>
  </>
}

export default ImagesList;