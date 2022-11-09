import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../context/Appcontext";
import axios from "axios";

function Search() {
  const { isLoggedIn } = useContext(AppContext);
  const [movieName, setMovieName] = useState("");
  const [playlists, setPlaylists] = useState();

  useEffect(() => {
    if (isLoggedIn === true) {
      const getAllplayList = async () => {
        const headers = {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        };
        const resposnse = await axios.get(
          "/api/v1/playlist/user-all-playlist",
          {
            headers,
          }
        );
        setPlaylists(resposnse.data.data);
      };
      getAllplayList();
    }
  }, [isLoggedIn]);

  const onchange = (e) => {
    setMovieName(e.target.value);
  };

  const navigate = useNavigate();
  const onsubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${movieName}`);
  };
  return (
    <>
      <main className="hero-section text-center">
        <div className="container container--narrow">
          <div className="hero-section__box">
            <h2>
              Search <span>Song </span>Name
            </h2>
          </div>

          <div className="hero-section__search">
            <form className="form" onSubmit={onsubmit}>
              <div className="form__field">
                <label htmlFor="formInput#search">Search By Name </label>
                <input
                  className="input input--text"
                  id="dishName"
                  onChange={onchange}
                  type="text"
                  name="text"
                  placeholder="Search by Name"
                />
              </div>

              <input
                className="btn btn--sub btn--lg"
                type="submit"
                value="Search"
              />
            </form>
          </div>
        </div>
      </main>
      <section className="devlist">
        <div className="container">
          <div className="grid grid--three">
            {playlists && playlists.length ? (
              playlists.map((item) => (
                <div className="column card" key={item._id}>
                  <div className="dev">
                    <div className="card__body">
                      <div className="dev__profile">
                        <div className="dev__meta">
                          {/* <Link to={`/playlist/${item._id}/${item.isPrivate}`}> */}
                          <h4>{item.playlist_name}</h4>
                          {/* </Link> */}
                          {item.isPrivate ? <h3>Private</h3> : <h3>Public</h3>}
                        </div>
                      </div>
                      <span>
                        <p>Link of playlist :</p>
                        <p className="dev__info">
                          {`/playlist/${item._id}/${item.isPrivate}`}
                        </p>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : isLoggedIn ? (
              <h4>You dont have any playlist</h4>
            ) : (
              <h4>You are not logged in</h4>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Search;
