
// Instead of importing from hooks/use-toast, we should export directly from the hooks
// This is creating a circular dependency

import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };
