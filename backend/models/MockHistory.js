const supabase = require("../config/supabase");

module.exports = {

  async save(userId, mock_name, score, total_marks, accuracy) {
    const { error } = await supabase
      .from("mock_history")
      .insert({
        user_id: userId,
        mock_name,
        score,
        total_marks,
        accuracy
      });

    if (error) throw error;
    return true;
  },

 
  async getHistory(userId) {
    const { data, error } = await supabase
      .from("mock_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
