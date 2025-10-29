import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Users as UsersIcon, Loader2, Search } from "lucide-react";
import TeamCard from "../components/TeamCard";
import { teamAPI } from "../utils/api";
import { updatePageMeta, pageSEO } from "../utils/seo";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [displayedMembers, setDisplayedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12; // Show 12 members per page
  const observerRef = useRef(null);

  useEffect(() => {
    // Update SEO meta tags for team page
    updatePageMeta({
      ...pageSEO.team,
      canonicalUrl: window.location.origin + "/team",
    });

    fetchTeamMembers();
  }, []);

  // Filter members when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMembers(teamMembers);
    } else {
      const filtered = teamMembers.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
    // Reset pagination when search changes
    setPage(1);
    setHasMore(true);
  }, [searchQuery, teamMembers]);

  // Load paginated data when filtered members or page changes
  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * ITEMS_PER_PAGE;
    const paginatedData = filteredMembers.slice(startIndex, endIndex);
    setDisplayedMembers(paginatedData);
    setHasMore(endIndex < filteredMembers.length);
  }, [filteredMembers, page]);

  const fetchTeamMembers = async () => {
    try {
      const response = await teamAPI.getAll();
      if (response.data.success) {
        setTeamMembers(response.data.data);
        setFilteredMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1);
        setLoadingMore(false);
      }, 500);
    }
  }, [loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  const lastMemberRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMore]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-4 sm:py-8">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-2">
              <UsersIcon size={48} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
              हमारी टीम
            </h1>
            <p className="text-lg sm:text-xl text-orange-50 max-w-2xl mx-auto">
              समर्पित और निष्ठावान कार्यकर्ता जो सोमगढ़ के विकास के लिए
              प्रतिबद्ध हैं
            </p>
            <div className="mt-4 h-1 w-24 bg-white mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-6 sm:py-10">
        <div className="section-container">
          {/* Marquee Banner */}
          <div className="mb-2 bg-gradient-to-r from-orange-500 to-green-500 text-white py-2 rounded-lg shadow-lg overflow-hidden">
            <marquee
              behavior="scroll"
              direction="left"
              scrollamount="5"
              className="text-lg sm:text-xl font-semibold text-center"
            >
              टीम में शामिल होने / सदस्य बनने के लिए अपना नाम, मोबाइल नंबर और
              फोटो 9572740290 पर व्हाट्सऐप करें। धन्यवाद
            </marquee>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="नाम से खोजें / Search by name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>
            {searchQuery && (
              <p className="text-center mt-2 text-sm text-gray-600">
                {filteredMembers.length} सदस्य मिले / {filteredMembers.length}{" "}
                members found
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2
                size={48}
                className="animate-spin text-orange-600 mb-4"
              />
              <p className="text-gray-600">Loading team members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <UsersIcon size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {searchQuery
                  ? "कोई सदस्य नहीं मिला / No Members Found"
                  : "No Team Members Yet"}
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "कृपया अलग नाम से खोजें / Please try a different search"
                  : "Team members will be displayed here soon."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {displayedMembers.map((member, index) => {
                  const isLastMember = index === displayedMembers.length - 1;
                  return (
                    <div
                      key={member._id}
                      ref={isLastMember ? lastMemberRef : null}
                    >
                      <TeamCard member={member} index={index} />
                    </div>
                  );
                })}
              </div>

              {/* Loading More Indicator */}
              {loadingMore && (
                <div className="flex justify-center py-8">
                  <Loader2 size={32} className="animate-spin text-orange-600" />
                </div>
              )}

              {/* End of Results */}
              {!hasMore && displayedMembers.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    सभी सदस्य दिखाए गए / All members displayed
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Team;
