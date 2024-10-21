import { toast } from "react-hot-toast"; 
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import themeAtom from "../atoms/themeAtom";

const useShowToast = () => {
	const theme = useRecoilValue(themeAtom)
	const showToast = useCallback(
		(title, description, status) => {
			toast[status](title, {
				duration: 3000,
				description,
				style: {
					color: status === "success" ? "green" : "red", 
				},
			});
		},
		[]
	);

	return showToast;
};

export default useShowToast;
