import userIcon from "../../assets/icons/reception.png"; // or .png

const Profile = () => {
  return (
    <div>
      <img
        src={userIcon}
        alt="User Icon"
        width={20}
        height={20}
        className="mr-4 opacity-50"
      />
    </div>
  );
};

export default Profile;
