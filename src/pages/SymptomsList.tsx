import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Card, Form, Button, Spinner, Offcanvas, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getSymptoms } from '../api/symptoms';
import { Symptom } from '../types';
import { RootState } from '../store/store';
import { setSearchQuery, setCategories } from '../store/filtersSlice';
import './SymptomsList.css';

export function SymptomsList() {
  const dispatch = useDispatch();
  const { searchQuery, categories } = useSelector((state: RootState) => state.filters);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Получаем уникальные категории из симптомов
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    symptoms.forEach(symptom => {
      if (symptom.category) {
        cats.add(symptom.category);
      }
    });
    return Array.from(cats).sort();
  }, [symptoms]);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getSymptoms();
        if (isMounted) {
          setSymptoms(data.results);
        }
      } catch (error) {
        console.error('Ошибка загрузки симптомов:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadSymptoms = async (search?: string) => {
    setLoading(true);
    try {
      const data = await getSymptoms(search);
      let filteredResults = data.results;
      
      // Фильтрация по категориям
      if (categories.length > 0) {
        filteredResults = filteredResults.filter(symptom => 
          symptom.category && categories.includes(symptom.category)
        );
      }
      
      setSymptoms(filteredResults);
    } catch (error) {
      console.error('Ошибка загрузки симптомов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchInput));
    loadSymptoms(searchInput);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = categories.includes(category)
      ? categories.filter(c => c !== category)
      : [...categories, category];
    dispatch(setCategories(newCategories));
  };

  // Перезагружаем симптомы при изменении категорий
  useEffect(() => {
    if (symptoms.length > 0 || searchQuery) {
      loadSymptoms(searchQuery);
    }
  }, [categories]);

  const getPointsLabel = (points: number): string => {
    const lastDigit = points % 10;
    const lastTwoDigits = points % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'баллов';
    }
    if (lastDigit === 1) {
      return 'балл';
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'балла';
    }
    return 'баллов';
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Главная', path: '/' },
        { label: 'Симптомы' }
      ]} />
      <Container className="symptoms-container">
        {/* Блок поиска и фильтров */}
        <div className="search-section">
          <div className="d-flex gap-2 align-items-center mb-3">
            <Form onSubmit={handleSearch} className="flex-grow-1">
              <Form.Group className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Поиск симптомов DVT или факторов риска..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="search-input"
                />
                <Button type="submit" variant="primary" className="search-btn">
                  Искать
                </Button>
              </Form.Group>
            </Form>
            {/* Кнопка фильтров для мобильных */}
            <Button
              variant="outline-primary"
              className="d-lg-none filters-toggle-btn"
              onClick={() => setShowFilters(true)}
            >
              Фильтры
              {categories.length > 0 && (
                <span className="badge bg-primary ms-2">{categories.length}</span>
              )}
            </Button>
          </div>
          
          {/* Фильтры по категориям - десктоп */}
          {availableCategories.length > 0 && (
            <div className="filters-desktop d-none d-lg-block">
              <div className="filter-label mb-2">Категории:</div>
              <div className="d-flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <Button
                    key={category}
                    variant={categories.includes(category) ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Мобильный drawer для фильтров */}
        <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Фильтры</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Категории</Accordion.Header>
                <Accordion.Body>
                  {availableCategories.length > 0 ? (
                    <div className="d-flex flex-column gap-2">
                      {availableCategories.map(category => (
                        <Form.Check
                          key={category}
                          type="checkbox"
                          label={category}
                          checked={categories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">Нет доступных категорий</p>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {categories.length > 0 && (
              <Button
                variant="outline-danger"
                size="sm"
                className="mt-3"
                onClick={() => dispatch(setCategories([]))}
              >
                Сбросить фильтры
              </Button>
            )}
          </Offcanvas.Body>
        </Offcanvas>

        {/* Список симптомов */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
          </div>
        ) : (
          <div className="symptoms-grid">
            {symptoms.map((symptom) => (
              <Card key={symptom.id} className="symptom-card">
                <Link to={`/symptoms/${symptom.id}`} className="card-link">
                  <Card.Img
                    variant="top"
                    src={symptom.image_url}
                    alt={symptom.name}
                    className="symptom-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Генерируем SVG placeholder
                      const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#E8F0F5"/><text x="50%" y="45%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#005BBB" text-anchor="middle" dominant-baseline="middle">🩺</text><text x="50%" y="60%" font-family="Arial, sans-serif" font-size="16" fill="#666666" text-anchor="middle" dominant-baseline="middle">Wells Method</text></svg>`;
                      target.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
                    }}
                  />
                  <Card.Body className="symptom-info">
                    <Card.Title className="symptom-title">{symptom.name}</Card.Title>
                    {symptom.category && (
                      <Card.Text className="category">{symptom.category}</Card.Text>
                    )}
                    <div className="points">
                      <span className="points-value">{symptom.points}</span>
                      <span className="points-label">{getPointsLabel(symptom.points)}</span>
                    </div>
                  </Card.Body>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {!loading && symptoms.length === 0 && (
          <div className="text-center py-5">
            <p>Симптомы не найдены</p>
          </div>
        )}
      </Container>
    </>
  );
}

