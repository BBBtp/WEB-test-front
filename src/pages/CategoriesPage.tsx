import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getSymptoms } from '../api/symptoms';
import { Symptom } from '../types';
import './CategoriesPage.css';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Map<string, Symptom[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await getSymptoms();
        const categoriesMap = new Map<string, Symptom[]>();
        
        data.results.forEach(symptom => {
          if (symptom.category) {
            const existing = categoriesMap.get(symptom.category) || [];
            categoriesMap.set(symptom.category, [...existing, symptom]);
          }
        });
        
        setCategories(categoriesMap);
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <>
        <Breadcrumbs items={[
          { label: 'Главная', path: '/' },
          { label: 'Категории' }
        ]} />
        <Container className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Главная', path: '/' },
        { label: 'Категории' }
      ]} />
      <Container className="categories-container">
        <h1 className="categories-title">Категории симптомов</h1>
        <Row className="g-4">
          {Array.from(categories.entries()).map(([categoryName, symptoms]) => (
            <Col key={categoryName} md={6} lg={4}>
              <Card className="category-card">
                <Link to={`/symptoms?category=${encodeURIComponent(categoryName)}`} className="category-link">
                  {symptoms[0]?.image_url && (
                    <Card.Img
                      variant="top"
                      src={symptoms[0].image_url}
                      alt={categoryName}
                      className="category-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#E8F0F5"/><text x="50%" y="45%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#005BBB" text-anchor="middle" dominant-baseline="middle">🩺</text><text x="50%" y="60%" font-family="Arial, sans-serif" font-size="16" fill="#666666" text-anchor="middle" dominant-baseline="middle">${categoryName}</text></svg>`;
                        target.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
                      }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{categoryName}</Card.Title>
                    <Card.Text>
                      {symptoms.length} {symptoms.length === 1 ? 'симптом' : symptoms.length < 5 ? 'симптома' : 'симптомов'}
                    </Card.Text>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

