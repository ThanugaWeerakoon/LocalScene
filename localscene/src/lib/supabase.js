import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bheduvpljuxhovkeqtye.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZWR1dnBsanV4aG92a2VxdHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjAzNTYsImV4cCI6MjA5MDUzNjM1Nn0.Tbq_PtsuK8sGl7jdxbFYqQFSOYg9ohEcBDB_MxldpmM";

export const supabase = createClient(supabaseUrl, supabaseKey);