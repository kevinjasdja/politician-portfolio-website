import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
  Shield,
  LogOut,
  Image,
  Users,
  Mail,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  Upload,
  X,
  Check,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import {
  heroAPI,
  teamAPI,
  contactAPI,
  beneficiaryAPI,
  galleryAPI,
} from "../utils/api";
import { getServerURL } from "../utils/constants";

const Admin = () => {
  const { admin, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("hero");
  const [loading, setLoading] = useState(false);

  // Hero Content State
  const [heroContent, setHeroContent] = useState(null);
  const [heroForm, setHeroForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    heroImage: null,
  });
  const [heroImagePreview, setHeroImagePreview] = useState(null);

  // Team State
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredTeamMembers, setFilteredTeamMembers] = useState([]);
  const [displayedTeamMembers, setDisplayedTeamMembers] = useState([]);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [teamPage, setTeamPage] = useState(1);
  const TEAM_MEMBERS_PER_PAGE = 9;
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: "",
    mobile: "",
    position: "",
    image: null,
  });
  const [teamImagePreview, setTeamImagePreview] = useState(null);

  // Contact State
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  // Beneficiary State
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
  const [displayedBeneficiaries, setDisplayedBeneficiaries] = useState([]);
  const [beneficiarySearchQuery, setBeneficiarySearchQuery] = useState("");
  const [beneficiaryPage, setBeneficiaryPage] = useState(1);
  const BENEFICIARIES_PER_PAGE = 10;

  // Gallery State
  const [galleryPosts, setGalleryPosts] = useState([]);
  const [filteredGalleryPosts, setFilteredGalleryPosts] = useState([]);
  const [displayedGalleryPosts, setDisplayedGalleryPosts] = useState([]);
  const [gallerySearchQuery, setGallerySearchQuery] = useState("");
  const [galleryPage, setGalleryPage] = useState(1);
  const GALLERY_POSTS_PER_PAGE = 5;
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    facebookLink: "",
    images: [],
  });
  const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);

  useEffect(() => {
    if (activeSection === "hero") fetchHeroContent();
    else if (activeSection === "team") fetchTeamMembers();
    else if (activeSection === "contacts") fetchContacts();
    else if (activeSection === "beneficiaries") fetchBeneficiaries();
    else if (activeSection === "gallery") fetchGalleryPosts();
  }, [activeSection]);

  // Filter team members when search query changes
  useEffect(() => {
    if (teamSearchQuery.trim() === "") {
      setFilteredTeamMembers(teamMembers);
    } else {
      const filtered = teamMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
          (member.position &&
            member.position
              .toLowerCase()
              .includes(teamSearchQuery.toLowerCase()))
      );
      setFilteredTeamMembers(filtered);
    }
    setTeamPage(1);
  }, [teamSearchQuery, teamMembers]);

  // Load paginated data for team members
  useEffect(() => {
    const startIndex = (teamPage - 1) * TEAM_MEMBERS_PER_PAGE;
    const endIndex = startIndex + TEAM_MEMBERS_PER_PAGE;
    const paginatedData = filteredTeamMembers.slice(startIndex, endIndex);
    setDisplayedTeamMembers(paginatedData);
  }, [filteredTeamMembers, teamPage]);

  // Filter gallery posts when search query changes
  useEffect(() => {
    if (gallerySearchQuery.trim() === "") {
      setFilteredGalleryPosts(galleryPosts);
    } else {
      const filtered = galleryPosts.filter((post) =>
        post.title.toLowerCase().includes(gallerySearchQuery.toLowerCase())
      );
      setFilteredGalleryPosts(filtered);
    }
    setGalleryPage(1);
  }, [gallerySearchQuery, galleryPosts]);

  // Load paginated data for gallery posts
  useEffect(() => {
    const startIndex = (galleryPage - 1) * GALLERY_POSTS_PER_PAGE;
    const endIndex = startIndex + GALLERY_POSTS_PER_PAGE;
    const paginatedData = filteredGalleryPosts.slice(startIndex, endIndex);
    setDisplayedGalleryPosts(paginatedData);
  }, [filteredGalleryPosts, galleryPage]);

  // Filter beneficiaries when search query changes
  useEffect(() => {
    if (beneficiarySearchQuery.trim() === "") {
      setFilteredBeneficiaries(beneficiaries);
    } else {
      const filtered = beneficiaries.filter(
        (beneficiary) =>
          beneficiary.name
            .toLowerCase()
            .includes(beneficiarySearchQuery.toLowerCase()) ||
          beneficiary.uniqueId
            .toLowerCase()
            .includes(beneficiarySearchQuery.toLowerCase())
      );
      setFilteredBeneficiaries(filtered);
    }
    // Reset pagination when search changes
    setBeneficiaryPage(1);
  }, [beneficiarySearchQuery, beneficiaries]);

  // Load paginated data for beneficiaries
  useEffect(() => {
    const startIndex = (beneficiaryPage - 1) * BENEFICIARIES_PER_PAGE;
    const endIndex = startIndex + BENEFICIARIES_PER_PAGE;
    const paginatedData = filteredBeneficiaries.slice(startIndex, endIndex);
    setDisplayedBeneficiaries(paginatedData);
  }, [filteredBeneficiaries, beneficiaryPage]);

  // Hero Functions
  const fetchHeroContent = async () => {
    setLoading(true);
    try {
      const response = await heroAPI.get();
      if (response.data.success) {
        const data = response.data.data;
        setHeroContent(data);
        setHeroForm({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          heroImage: null,
        });
        if (data.heroImage) {
          setHeroImagePreview(
            data.heroImage.startsWith("http")
              ? data.heroImage
              : `${getServerURL()}${data.heroImage}`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching hero content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroForm({ ...heroForm, heroImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setHeroImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", heroForm.title);
      formData.append("subtitle", heroForm.subtitle);
      formData.append("description", heroForm.description);
      if (heroForm.heroImage) formData.append("heroImage", heroForm.heroImage);

      await heroAPI.update(formData);
      alert("Hero content updated successfully!");
      fetchHeroContent();
    } catch (error) {
      console.error("Error updating hero content:", error);
      alert("Failed to update hero content");
    } finally {
      setLoading(false);
    }
  };

  // Team Functions
  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await teamAPI.getAll();
      if (response.data.success) {
        setTeamMembers(response.data.data);
        setFilteredTeamMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSearchChange = (e) => {
    setTeamSearchQuery(e.target.value);
  };

  const handleTeamPageChange = (newPage) => {
    setTeamPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalTeamPages = Math.ceil(
    filteredTeamMembers.length / TEAM_MEMBERS_PER_PAGE
  );

  const handleTeamImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamForm({ ...teamForm, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setTeamImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", teamForm.name);
      formData.append("mobile", teamForm.mobile);
      formData.append("position", teamForm.position);
      if (teamForm.image) formData.append("image", teamForm.image);

      if (editingTeam) {
        await teamAPI.update(editingTeam._id, formData);
        alert("Team member updated successfully!");
      } else {
        await teamAPI.create(formData);
        alert("Team member added successfully!");
      }

      setShowTeamForm(false);
      setEditingTeam(null);
      setTeamForm({ name: "", mobile: "", position: "", image: null });
      setTeamImagePreview(null);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error saving team member:", error);
      alert("Failed to save team member");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeam = (member) => {
    setEditingTeam(member);
    setTeamForm({
      name: member.name,
      mobile: member.mobile,
      position: member.position || "",
      image: null,
    });
    setTeamImagePreview(
      member.image.startsWith("http")
        ? member.image
        : `${getServerURL()}${member.image}`
    );
    setShowTeamForm(true);
  };
  const handleDeleteTeam = async (id) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    setLoading(true);
    try {
      await teamAPI.delete(id);
      alert("Team member deleted successfully!");
      fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      alert("Failed to delete team member");
    } finally {
      setLoading(false);
    }
  };

  // Contact Functions
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await contactAPI.getAll();
      if (response.data.success) {
        setContacts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setLoading(true);
    try {
      await contactAPI.delete(id);
      alert("Message deleted successfully!");
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete message");
    } finally {
      setLoading(false);
    }
  };

  // Beneficiary Functions
  const fetchBeneficiaries = async () => {
    setLoading(true);
    try {
      const response = await beneficiaryAPI.getAll();
      if (response.data.success) {
        setBeneficiaries(response.data.data);
        setFilteredBeneficiaries(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBeneficiarySearchChange = (e) => {
    setBeneficiarySearchQuery(e.target.value);
  };

  const handleBeneficiaryPageChange = (newPage) => {
    setBeneficiaryPage(newPage);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalBeneficiaryPages = Math.ceil(
    filteredBeneficiaries.length / BENEFICIARIES_PER_PAGE
  );

  const handleDeleteBeneficiary = async (id) => {
    if (!confirm("Are you sure you want to delete this beneficiary card?"))
      return;

    setLoading(true);
    try {
      await beneficiaryAPI.delete(id);
      alert("Beneficiary card deleted successfully!");
      fetchBeneficiaries();
    } catch (error) {
      console.error("Error deleting beneficiary:", error);
      alert("Failed to delete beneficiary card");
    } finally {
      setLoading(false);
    }
  };

  // Gallery Functions
  const fetchGalleryPosts = async () => {
    setLoading(true);
    try {
      const response = await galleryAPI.getAll();
      if (response.data.success) {
        setGalleryPosts(response.data.data);
        setFilteredGalleryPosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching gallery posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGallerySearchChange = (e) => {
    setGallerySearchQuery(e.target.value);
  };

  const handleGalleryPageChange = (newPage) => {
    setGalleryPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalGalleryPages = Math.ceil(
    filteredGalleryPosts.length / GALLERY_POSTS_PER_PAGE
  );

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGalleryForm({ ...galleryForm, images: files });

      // Create previews
      const previews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setGalleryImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", galleryForm.title);
      formData.append("description", galleryForm.description);
      formData.append("facebookLink", galleryForm.facebookLink);

      galleryForm.images.forEach((image) => {
        formData.append("images", image);
      });

      if (editingGallery) {
        await galleryAPI.update(editingGallery._id, formData);
        alert("Gallery post updated successfully!");
      } else {
        await galleryAPI.create(formData);
        alert("Gallery post created successfully!");
      }

      setShowGalleryForm(false);
      setEditingGallery(null);
      setGalleryForm({
        title: "",
        description: "",
        facebookLink: "",
        images: [],
      });
      setGalleryImagePreviews([]);
      fetchGalleryPosts();
    } catch (error) {
      console.error("Error saving gallery post:", error);
      alert("Failed to save gallery post");
    } finally {
      setLoading(false);
    }
  };

  const handleEditGallery = (post) => {
    setEditingGallery(post);
    setGalleryForm({
      title: post.title,
      description: post.description,
      facebookLink: post.facebookLink || "",
      images: [],
    });
    setGalleryImagePreviews(post.images);
    setShowGalleryForm(true);
  };

  const handleDeleteGallery = async (id) => {
    if (!confirm("Are you sure you want to delete this gallery post?")) return;

    setLoading(true);
    try {
      await galleryAPI.delete(id);
      alert("Gallery post deleted successfully!");
      fetchGalleryPosts();
    } catch (error) {
      console.error("Error deleting gallery post:", error);
      alert("Failed to delete gallery post");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "hero", label: "Hero Content", icon: Image },
    { id: "team", label: "Team Members", icon: Users },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "contacts", label: "Contact Messages", icon: Mail },
    { id: "beneficiaries", label: "Beneficiary Cards", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield size={32} />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-orange-100">
                  Welcome, {admin?.name}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
        {/* Section Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`p-4 rounded-lg font-semibold transition-all duration-300 flex flex-col items-center space-y-2 ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                }`}
              >
                <Icon size={24} />
                <span className="text-sm">{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Hero Content Section */}
          {activeSection === "hero" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Update Hero Content
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={48} className="animate-spin text-orange-600" />
                </div>
              ) : (
                <form onSubmit={handleHeroSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hero Image
                    </label>
                    {heroImagePreview && (
                      <div className="mb-4 relative w-full h-64 rounded-lg overflow-hidden">
                        <img
                          src={heroImagePreview}
                          alt="Hero"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="cursor-pointer bg-orange-50 border-2 border-dashed border-orange-300 rounded-lg p-6 w-full hover:bg-orange-100 transition-colors text-center block">
                      <Upload
                        className="mx-auto text-orange-500 mb-2"
                        size={32}
                      />
                      <p className="text-sm text-gray-600">
                        Click to upload new hero image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={heroForm.title}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={heroForm.subtitle}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, subtitle: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={heroForm.description}
                      onChange={(e) =>
                        setHeroForm({
                          ...heroForm,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Hero Content"}
                  </button>
                </form>
              )}
            </div>
          )}
          {/* Team Members Section */}
          {activeSection === "team" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Team Members ({filteredTeamMembers.length})
                </h2>
                <button
                  onClick={() => {
                    setShowTeamForm(!showTeamForm);
                    setEditingTeam(null);
                    setTeamForm({
                      name: "",
                      mobile: "",
                      position: "",
                      image: null,
                    });
                    setTeamImagePreview(null);
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  {showTeamForm ? <X size={20} /> : <Plus size={20} />}
                  <span>{showTeamForm ? "Cancel" : "Add Member"}</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search by name or position..."
                    value={teamSearchQuery}
                    onChange={handleTeamSearchChange}
                    className="w-full pl-4 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>
                {teamSearchQuery && (
                  <p className="mt-2 text-sm text-gray-600">
                    Found {filteredTeamMembers.length} team members
                  </p>
                )}
              </div>

              {showTeamForm && (
                <form
                  onSubmit={handleTeamSubmit}
                  className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4"
                >
                  <h3 className="font-bold text-lg">
                    {editingTeam ? "Edit" : "Add"} Team Member
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Photo
                    </label>
                    {teamImagePreview && (
                      <div className="mb-4 w-32 h-32 rounded-lg overflow-hidden">
                        <img
                          src={teamImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTeamImageChange}
                      required={!editingTeam}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={teamForm.name}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, name: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile *
                      </label>
                      <input
                        type="tel"
                        value={teamForm.mobile}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, mobile: e.target.value })
                        }
                        required
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={teamForm.position}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, position: e.target.value })
                        }
                        placeholder="e.g., Secretary, Treasurer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-lg font-bold"
                  >
                    {loading
                      ? "Saving..."
                      : editingTeam
                      ? "Update Member"
                      : "Add Member"}
                  </button>
                </form>
              )}

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={48} className="animate-spin text-orange-600" />
                </div>
              ) : filteredTeamMembers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {teamSearchQuery
                    ? "No team members found matching your search."
                    : "No team members yet. Add your first team member!"}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedTeamMembers.map((member) => (
                      <div
                        key={member._id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <img
                          src={
                            member.image.startsWith("http")
                              ? member.image
                              : `${getServerURL()}${member.image}`
                          }
                          alt={member.name}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-bold text-lg">{member.name}</h4>
                        {member.position && (
                          <p className="text-sm text-orange-600">
                            {member.position}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">{member.mobile}</p>
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => handleEditTeam(member)}
                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-1"
                          >
                            <Edit2 size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(member._id)}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center space-x-1"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalTeamPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-4">
                      <div className="text-sm text-gray-600">
                        Showing {(teamPage - 1) * TEAM_MEMBERS_PER_PAGE + 1} to{" "}
                        {Math.min(
                          teamPage * TEAM_MEMBERS_PER_PAGE,
                          filteredTeamMembers.length
                        )}{" "}
                        of {filteredTeamMembers.length} members
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTeamPageChange(teamPage - 1)}
                          disabled={teamPage === 1}
                          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Previous
                        </button>
                        <div className="flex space-x-1">
                          {[...Array(totalTeamPages)].map((_, index) => {
                            const pageNum = index + 1;
                            if (
                              pageNum === 1 ||
                              pageNum === totalTeamPages ||
                              (pageNum >= teamPage - 1 &&
                                pageNum <= teamPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handleTeamPageChange(pageNum)}
                                  className={`px-4 py-2 rounded-lg transition-colors ${
                                    teamPage === pageNum
                                      ? "bg-orange-500 text-white"
                                      : "border hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            } else if (
                              pageNum === teamPage - 2 ||
                              pageNum === teamPage + 2
                            ) {
                              return (
                                <span key={pageNum} className="px-2">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <button
                          onClick={() => handleTeamPageChange(teamPage + 1)}
                          disabled={teamPage === totalTeamPages}
                          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {/* Contact Messages Section */}
          {activeSection === "contacts" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Contact Messages
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={48} className="animate-spin text-orange-600" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No contact messages yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg">{contact.name}</h4>
                          <p className="text-sm text-gray-600">
                            {contact.email} | {contact.mobile}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className="text-gray-700 mb-2">{contact.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(contact.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Beneficiary Cards Section */}
          {activeSection === "beneficiaries" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Beneficiary Cards ({filteredBeneficiaries.length})
                </h2>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search by ID or Name..."
                    value={beneficiarySearchQuery}
                    onChange={handleBeneficiarySearchChange}
                    className="w-full pl-4 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>
                {beneficiarySearchQuery && (
                  <p className="mt-2 text-sm text-gray-600">
                    Found {filteredBeneficiaries.length} beneficiaries
                  </p>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={48} className="animate-spin text-orange-600" />
                </div>
              ) : filteredBeneficiaries.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {beneficiarySearchQuery
                    ? "No beneficiaries found matching your search."
                    : "No beneficiary cards yet."}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Unique ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Village
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Ward
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Mobile
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedBeneficiaries.map((beneficiary) => (
                          <tr
                            key={beneficiary._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-sm font-mono">
                              {beneficiary.uniqueId}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold">
                              {beneficiary.name}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {beneficiary.village}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {beneficiary.wardNo}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {beneficiary.mobile}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(
                                beneficiary.createdAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() =>
                                  handleDeleteBeneficiary(beneficiary._id)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalBeneficiaryPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-4">
                      <div className="text-sm text-gray-600">
                        Showing{" "}
                        {(beneficiaryPage - 1) * BENEFICIARIES_PER_PAGE + 1} to{" "}
                        {Math.min(
                          beneficiaryPage * BENEFICIARIES_PER_PAGE,
                          filteredBeneficiaries.length
                        )}{" "}
                        of {filteredBeneficiaries.length} beneficiaries
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleBeneficiaryPageChange(beneficiaryPage - 1)
                          }
                          disabled={beneficiaryPage === 1}
                          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Previous
                        </button>
                        <div className="flex space-x-1">
                          {[...Array(totalBeneficiaryPages)].map((_, index) => {
                            const pageNum = index + 1;
                            // Show first, last, current, and adjacent pages
                            if (
                              pageNum === 1 ||
                              pageNum === totalBeneficiaryPages ||
                              (pageNum >= beneficiaryPage - 1 &&
                                pageNum <= beneficiaryPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() =>
                                    handleBeneficiaryPageChange(pageNum)
                                  }
                                  className={`px-4 py-2 rounded-lg transition-colors ${
                                    beneficiaryPage === pageNum
                                      ? "bg-orange-500 text-white"
                                      : "border hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            } else if (
                              pageNum === beneficiaryPage - 2 ||
                              pageNum === beneficiaryPage + 2
                            ) {
                              return (
                                <span key={pageNum} className="px-2">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <button
                          onClick={() =>
                            handleBeneficiaryPageChange(beneficiaryPage + 1)
                          }
                          disabled={beneficiaryPage === totalBeneficiaryPages}
                          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}{" "}
          {/* Gallery Section */}
          {activeSection === "gallery" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Gallery Posts ({filteredGalleryPosts.length})
                </h2>
                <button
                  onClick={() => {
                    setShowGalleryForm(!showGalleryForm);
                    setEditingGallery(null);
                    setGalleryForm({
                      title: "",
                      description: "",
                      facebookLink: "",
                      images: [],
                    });
                    setGalleryImagePreviews([]);
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  {showGalleryForm ? <X size={20} /> : <Plus size={20} />}
                  <span>{showGalleryForm ? "Cancel" : "Add Post"}</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={gallerySearchQuery}
                    onChange={handleGallerySearchChange}
                    className="w-full pl-4 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>
                {gallerySearchQuery && (
                  <p className="mt-2 text-sm text-gray-600">
                    Found {filteredGalleryPosts.length} gallery posts
                  </p>
                )}
              </div>

              {showGalleryForm && (
                <form
                  onSubmit={handleGallerySubmit}
                  className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4"
                >
                  <h3 className="font-bold text-lg">
                    {editingGallery ? "Edit" : "Create"} Gallery Post
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Images * (Multiple images allowed)
                    </label>
                    {galleryImagePreviews.length > 0 && (
                      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {galleryImagePreviews.map((preview, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-lg overflow-hidden"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesChange}
                      required={!editingGallery}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can select multiple images at once (Max 10 images)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={galleryForm.title}
                      onChange={(e) =>
                        setGalleryForm({
                          ...galleryForm,
                          title: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter post title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={galleryForm.description}
                      onChange={(e) =>
                        setGalleryForm({
                          ...galleryForm,
                          description: e.target.value,
                        })
                      }
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter post description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Facebook Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={galleryForm.facebookLink}
                      onChange={(e) =>
                        setGalleryForm({
                          ...galleryForm,
                          facebookLink: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-lg font-bold"
                  >
                    {loading
                      ? "Saving..."
                      : editingGallery
                      ? "Update Post"
                      : "Create Post"}
                  </button>
                </form>
              )}

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={48} className="animate-spin text-orange-600" />
                </div>
              ) : filteredGalleryPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {gallerySearchQuery
                    ? "No gallery posts found matching your search."
                    : "No gallery posts yet. Create your first post!"}
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {displayedGalleryPosts.map((post) => (
                      <div
                        key={post._id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-800">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString(
                                "hi-IN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditGallery(post)}
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteGallery(post._id)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                          {post.images.map((image, idx) => (
                            <div
                              key={idx}
                              className="aspect-square rounded-lg overflow-hidden"
                            >
                              <img
                                src={image}
                                alt={`${post.title} - ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>

                        <p className="text-gray-700 text-sm mb-2">
                          {post.description}
                        </p>

                        {post.facebookLink && (
                          <a
                            href={post.facebookLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline flex items-center space-x-1"
                          >
                            <ExternalLink size={14} />
                            <span>View on Facebook</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalGalleryPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-4">
                      <div className="text-sm text-gray-600">
                        Showing {(galleryPage - 1) * GALLERY_POSTS_PER_PAGE + 1}{" "}
                        to{" "}
                        {Math.min(
                          galleryPage * GALLERY_POSTS_PER_PAGE,
                          filteredGalleryPosts.length
                        )}{" "}
                        of {filteredGalleryPosts.length} posts
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleGalleryPageChange(galleryPage - 1)
                          }
                          disabled={galleryPage === 1}
                          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Previous
                        </button>
                        <div className="flex space-x-1">
                          {[...Array(totalGalleryPages)].map((_, index) => {
                            const pageNum = index + 1;
                            if (
                              pageNum === 1 ||
                              pageNum === totalGalleryPages ||
                              (pageNum >= galleryPage - 1 &&
                                pageNum <= galleryPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() =>
                                    handleGalleryPageChange(pageNum)
                                  }
                                  className={`px-4 py-2 rounded-lg transition-colors ${
                                    galleryPage === pageNum
                                      ? "bg-orange-500 text-white"
                                      : "border hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            } else if (
                              pageNum === galleryPage - 2 ||
                              pageNum === galleryPage + 2
                            ) {
                              return (
                                <span key={pageNum} className="px-2">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <button
                          onClick={() =>
                            handleGalleryPageChange(galleryPage + 1)
                          }
                          disabled={galleryPage === totalGalleryPages}
                          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
