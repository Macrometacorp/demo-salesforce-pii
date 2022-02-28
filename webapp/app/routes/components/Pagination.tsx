export const Pagination = ({
  contactsPerPage,
  totalContacts,
  paginate,
  currentPage,
}: {
  contactsPerPage: number;
  totalContacts: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalContacts / contactsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="card items-center left-0 right-0">
      <div className="max-w-sm card-body">
        <p>
          Showing{" "}
          <span>{currentPage * contactsPerPage - contactsPerPage + 1} </span>
          to
          <span>
            {" "}
            {totalContacts < currentPage * contactsPerPage
              ? totalContacts
              : currentPage * contactsPerPage}{" "}
          </span>
          of
          <span> {totalContacts} </span>
        </p>
      </div>
      <div className="btn-group" style={{ marginTop: "-20px" }}>
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={
              currentPage === number ? "btn btn-sm btn-active" : "btn btn-sm"
            }
            onClick={() => {
              paginate(number);
            }}
          >
            {" "}
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};
