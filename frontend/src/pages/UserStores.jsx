import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function UserStores() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [nameSearch, setNameSearch] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingValues, setRatingValues] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const loadStores = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();

      if (nameSearch.trim()) {
        params.append('name', nameSearch.trim());
      }

      if (addressSearch.trim()) {
        params.append('address', addressSearch.trim());
      }

      const query = params.toString();

      const response = await api.get(
        query ? `/stores?${query}` : '/stores'
      );

      setStores(response.data.stores || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to load stores.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialStores = async () => {
      try {
        const response = await api.get('/stores');
        setStores(response.data.stores || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Unable to load stores.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialStores();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setMessage('');
    await loadStores();
  };

  const handleClear = async () => {
    setNameSearch('');
    setAddressSearch('');
    setMessage('');
    setError('');

    try {
      setLoading(true);

      const response = await api.get('/stores');

      setStores(response.data.stores || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to load stores.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (storeId, value) => {
    setRatingValues((previous) => ({
      ...previous,
      [storeId]: value
    }));
  };

  const getUserRating = (store) => {
    return store.user_rating ?? null;
  };

  const handleRatingSubmit = async (store) => {
    const rating = Number(ratingValues[store.id]);

    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5.');
      setMessage('');
      return;
    }

    try {
      setSubmittingId(store.id);
      setError('');
      setMessage('');

      const existingRating = getUserRating(store);

      if (existingRating) {
        await api.put(`/ratings/${store.id}`, {
          rating
        });

        setMessage('Rating updated successfully.');
      } else {
        await api.post('/ratings', {
          storeId: store.id,
          rating
        });

        setMessage('Rating submitted successfully.');
      }

      setRatingValues((previous) => ({
        ...previous,
        [store.id]: ''
      }));

      await loadStores();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to save rating.'
      );
      setMessage('');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  return (
    <div className="user-page">
      <header className="topbar">
        <div>
          <div className="topbar-brand">StoreRate</div>
          <div className="topbar-subtitle">Store Ratings</div>
        </div>

        <div className="topbar-right">
          <span className="welcome-text">
            {user.name || 'User'}
          </span>

          <button
            className="secondary-button"
         onClick={() => navigate('/change-password')}
          >
            Change Password
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="user-content">
        <div className="page-heading">
          <h1>Find a Store</h1>
          <p>
            Search stores and share your rating from 1 to 5.
          </p>
        </div>

        <form
          className="store-search"
          onSubmit={handleSearch}
        >
          <div className="search-field">
            <label htmlFor="storeName">
              Store Name
            </label>

            <input
              id="storeName"
              type="text"
              value={nameSearch}
              onChange={(event) =>
                setNameSearch(event.target.value)
              }
              placeholder="Search by store name"
            />
          </div>

          <div className="search-field">
            <label htmlFor="storeAddress">
              Address
            </label>

            <input
              id="storeAddress"
              type="text"
              value={addressSearch}
              onChange={(event) =>
                setAddressSearch(event.target.value)
              }
              placeholder="Search by address"
            />
          </div>

          <button
            type="submit"
            className="primary-button search-button"
          >
            Search
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={handleClear}
          >
            Clear
          </button>
        </form>

        {error && (
          <div className="error-message user-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message user-message">
            {message}
          </div>
        )}

        {loading ? (
          <div className="loading-card">
            Loading stores...
          </div>
        ) : stores.length === 0 ? (
          <div className="empty-card">
            No stores found.
          </div>
        ) : (
          <div className="store-list">
            {stores.map((store) => {
              const userRating = getUserRating(store);

              return (
                <div
                  className="store-card"
                  key={store.id}
                >
                  <div className="store-info">
                    <h2>{store.name}</h2>

                    <p className="store-address">
                      {store.address}
                    </p>

                    <div className="rating-info">
                      <span>
                        Overall Rating
                      </span>

                      <strong>
                        {Number(
                          store.average_rating ?? 0
                        ).toFixed(2)}
                        / 5
                      </strong>
                    </div>

                    <div className="rating-info">
                      <span>
                        Your Submitted Rating
                      </span>

                      <strong>
                        {userRating
                          ? `${userRating}/5`
                          : 'Not rated yet'}
                      </strong>
                    </div>
                  </div>

                  <div className="rating-action">
                    <label
                      htmlFor={`rating-${store.id}`}
                    >
                      {userRating
                        ? 'Modify your rating'
                        : 'Submit your rating'}
                    </label>

                    <select
                      id={`rating-${store.id}`}
                      value={ratingValues[store.id] || ''}
                      onChange={(event) =>
                        handleRatingChange(
                          store.id,
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        Select rating
                      </option>

                      <option value="1">
                        1 - Very Poor
                      </option>

                      <option value="2">
                        2 - Poor
                      </option>

                      <option value="3">
                        3 - Average
                      </option>

                      <option value="4">
                        4 - Good
                      </option>

                      <option value="5">
                        5 - Excellent
                      </option>
                    </select>

                    <button
                      type="button"
                      className="primary-button"
                      disabled={
                        submittingId === store.id
                      }
                      onClick={() =>
                        handleRatingSubmit(store)
                      }
                    >
                      {submittingId === store.id
                        ? 'Saving...'
                        : userRating
                          ? 'Update Rating'
                          : 'Submit Rating'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default UserStores;	
