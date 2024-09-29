const { supabase } = require("../common/common");

const findAll = async () => {
  try {
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, email, username, major_id, role_id, create_at");

    if (usersError) {
      console.error("Error fetching users data:", usersError);
      throw new Error("Failed to fetch users data");
    }

    const usersWithMajorAndRole = await Promise.all(
      usersData.map(async (user) => {
        const { data: majorData, error: majorError } = await supabase
          .from("major")
          .select("major_name")
          .eq("id", user.major_id);

        if (majorError) {
          console.error("Error fetching major data:", majorError);
          throw new Error("Failed to fetch major data");
        }

        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .select("role_name")
          .eq("id", user.role_id);

        if (roleError) {
          console.error("Error fetching role data:", roleError);
          throw new Error("Failed to fetch role data");
        }

        return {
          ...user,
          major_name: majorData.length > 0 ? majorData[0].major_name : null,
          role_name: roleData.length > 0 ? roleData[0].role_name : null,
        };
      })
    );

    return usersWithMajorAndRole;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, username, major_id, role_id, create_at")
      .eq("id", id)
      .single();

    if (userError) {
      console.error(userError);
      throw new Error("Failed to fetch user data");
    }

    const { data: majorData, error: majorError } = await supabase
      .from("major")
      .select("major_name")
      .eq("id", userData.major_id)
      .single();

    if (majorError) {
      console.error("Error fetching major data:", majorError);
      throw new Error("Failed to fetch major data");
    }

    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role_name")
      .eq("id", userData.role_id)
      .single();

    if (roleError) {
      console.error("Error fetching role data:", roleError);
      throw new Error("Failed to fetch role data");
    }

    return {
      ...userData,
      major_name: majorData ? majorData.major_name : null,
      role_name: roleData ? roleData.role_name : null,
    };
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

const updateUser = async (id, updates) => {
  try {
    const { data: updatedUserData, error: updateError } = await supabase
      .from("users")
      .update({ ...updates })
      .eq("id", id)
      .single();

    if (updateError) {
      console.error("Error updating user data:", updateError);
      throw new Error("Failed to update user data");
    }

    return updatedUserData;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting user data:", deleteError);
      throw new Error("Failed to delete user data");
    }

    return `User with id ${id} deleted successfully`;
  } catch (error) {
    console.error("Internal server error:", error);
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  updateUser,
  deleteUser,
};
