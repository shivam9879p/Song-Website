import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import AppContext from "../context/Appcontext";
import Spinner from "../components/Spinner";
import usePagination from "../hooks/usePagination";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import AddModal from "./AddModal";
import { toast } from "react-toastify";
import NotFound from "./NotFound";
import "../static/app.css";
function Main() {
  const params = useParams();
  const [movie, setMovie] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const { isLoading, setLoading, isLoggedIn } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [addFieldModal, setAddFieldModal] = useState(false);
  const { previousPage, nextPage, totalPages, data } = usePagination(
    movie,
    currentPage,
    12
  );
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      // const data1 = await axios(
      //   `https://www.omdbapi.com/?s=${params.id}&apikey=1f59a830`
      // );

      const options = {
        method: "GET",
        url: "https://shazam.p.rapidapi.com/search",
        params: { term: params.id, locale: "en-US", offset: "0", limit: "5" },
        headers: {
          "X-RapidAPI-Key":
            "a759caa3a5mshab0a5991948608cp1f4f09jsnf5d467d376b7",
          "X-RapidAPI-Host": "shazam.p.rapidapi.com",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          // console.log("Data Coming");
          // console.log(response.data.tracks.hits);
          setMovie(response.data.tracks.hits);
          setLoading(false);
        })
        .catch(function (error) {
          console.error(error);
          setLoading(false);
        });
      // console.log(options.data);
      // setMovie(data1.data.Search);
    };
    getData();
  }, [params.id, setLoading]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <main className="projects">
        <section className="projectsList">
          <div className="container">
            <div className="grid grid--four">
              {modalOpen && (
                <Modal
                  movie={currentMovie}
                  setAddFieldModal={setAddFieldModal}
                  setOpenModal={setModalOpen}
                />
              )}
              {addFieldModal && (
                <AddModal setAddFieldModal={setAddFieldModal} />
              )}
              {data && data.length ? (
                data.map((movie) => (
                  <div className="column" key={movie.key}>
                    <div className="card project">
                      <div className="project">
                        <img
                          src={movie.track.images.background}
                          alt="Image_Poster"
                        />
                      </div>
                      <div className="card__body">
                        <Link to={`/single/${movie.imdbID}`}>
                          <h3 className="project__title">{movie.Title}</h3>
                        </Link>
                        <div className="flex">
                          <p className="project--rating">
                            <span></span> {movie.track.share.subject}
                          </p>
                          <div
                            className="modal"
                            onClick={() => {
                              if (isLoggedIn) {
                                setModalOpen(true);
                                setCurrentMovie(movie);
                              } else {
                                toast.error("You are not logged in");
                              }
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              style={{ height: "20px" }}
                              preserveAspectRatio="xMidYMid meet"
                              focusable="false"
                              className="style-scope yt-icon"
                            >
                              <g className="style-scope yt-icon">
                                <path
                                  d="M22,13h-4v4h-2v-4h-4v-2h4V7h2v4h4V13z M14,7H2v1h12V7z M2,12h8v-1H2V12z M2,16h8v-1H2V16z"
                                  className="style-scope yt-icon"
                                ></path>
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <a
                        href={movie.track.url}
                        target="blank"
                        style={{ display: "flex" }}
                      >
                        <button
                          className="play_button"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "auto",
                            marginBottom: "10px",
                            borderRadius: "5px",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                            color: "white",
                            backgroundColor: "#2d2d39",
                          }}
                        >
                          Play
                        </button>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <NotFound message={"There is no movie/show of this name"} />
              )}
            </div>
          </div>
        </section>

        <div className="pagination">
          <ul className="container">
            {previousPage && (
              <li>
                <div
                  onClick={() => setCurrentPage(previousPage)}
                  className="btn "
                >
                  &#10094; Prev
                </div>
              </li>
            )}

            {totalPages &&
              Array(totalPages)
                .fill(1)
                .map((_, idx) => (
                  <li key={uuidv4()}>
                    <div
                      className={`btn ${currentPage === idx + 1 && "btn--sub"}`}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </div>
                  </li>
                ))}
            {nextPage && (
              <li>
                <div onClick={() => setCurrentPage(nextPage)} className="btn">
                  Next &#10095;
                </div>
              </li>
            )}
          </ul>
        </div>
      </main>
    </>
  );
}

export default Main;
