import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import API from '../API/Api.mjs';


function ImageCard({ image, onVote, voting, alreadyVoted }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={image.url} alt={image.titolo} style={{ objectFit: 'cover', height: 200 }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-5">{image.titolo || `Immagine #${image.id}`}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Autore: {image.autore || image.name || 'Sconosciuto'}</Card.Subtitle>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">Voti: {image.voti ?? 0}</small>
          <Button variant="danger" onClick={() => onVote(image.id)} disabled={voting || alreadyVoted}>
            {alreadyVoted ? 'Hai già votato' : (voting ? 'Votando...' : 'Vota')}
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

  useEffect(() => {
    fetchImages();
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

  async function handleVote(id) {
    if (votingId) return;
    setVotingId(id);
    try {
      await API.voteImage(id);

      setImages(prev => prev.map(img => 
        img.id === id 
          ? { ...img, voti: (img.voti ?? 0) + 1, voted: true } 
          : img
      ));
    } catch (err) {
      console.error('Errore durante il voto:', err);
      alert('Impossibile registrare il voto. Assicurati di essere autenticato.');
    } finally {
      setVotingId(null);
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Vota le tue immagini preferite</h2>

      {loading ? (
        <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>
      ) : images.length === 0 ? (
        <p>Nessuna immagine disponibile.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          {images.map(img => (
            <Col key={img.id}>
              <ImageCard image={img} onVote={handleVote} voting={votingId === img.id} alreadyVoted={img.voted} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ImagesList;