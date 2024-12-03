"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { setField } from "@/services/helpers.service";
import { AUTH_SERVICE } from "@/services/api.service";
import Loader from "@/components/common/Loader";


const SignUp: React.FC = () => {

	// const [form, setForm] = useState({
	// 	email: '',
	// 	password: '',
	// 	name: '',
	// 	phone: '',
	// 	cf_password: '',
	// 	user_type: 'USER'
	// });

	// const [loading, setLoading] = useState(false);

	// const [error, setError] = useState({
	// 	email: '',
	// 	password: '',
	// 	name: '',
	// 	phone: '',
	// 	cf_password: '',
	// });
	// const [errorForm, setErrorForm] = useState('');


	// const onSubmit = async (e: any) => {
	// 	e.preventDefault();
	// 	let count = 0;
	// 	let objError: any = {
	// 		name: '',
	// 		email: '',
	// 		password: '',
	// 		cf_password: '',
	// 	}

	// 	if (!form.name || form.name == '') {
	// 		objError.name = 'Họ tên không được để trống.'
	// 		count++;
	// 	}
	// 	if (!form.email || form.email == '') {
	// 		objError.email = 'Email không được để trống.'
	// 		count++;
	// 	}

	// 	if (!form.password || form.password == '') {
	// 		objError.password = 'Password không được để trống.'
	// 		count++;
	// 	}

	// 	if (!form.cf_password || form.cf_password == '') {
	// 		objError.cf_password = 'Confirm password không được để trống.'
	// 		count++;
	// 	}

	// 	console.log(objError);

	// 	if (count > 0) {
	// 		setError(objError);
	// 		return;
	// 	}
	// 	if (form.cf_password != form.password) {
	// 		objError.cf_password = 'Xác nhận đúng mật khẩu.'
	// 		setError(objError);
	// 		return;
	// 	}
	// 	setLoading(true);
	// 	const response: any = await AUTH_SERVICE.register(form);
	// 	setLoading(false);

	// 	if (response?.status == 'success') {
	// 		setErrorForm('');
	// 		window.location.href = '/auth/signin';
	// 	} else {
	// 		setErrorForm(response?.message || 'Lỗi khi đăng ký')
	// 	}
	// }

	// console.log(error);




















	const [form, setForm] = useState({
		email: "",
		password: "",
		name: "",
		phone: "",
		cf_password: "",
		user_type: "USER",
	  });
	
	  const [loading, setLoading] = useState(false);
	
	  const [error, setError] = useState({
		email: "",
		password: "",
		name: "",
		phone: "",
		cf_password: "",
	  });
	
	  const [errorForm, setErrorForm] = useState("");
	
	  const passwordPattern = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$");
	
	  const handlePasswordChange = (e: any) => {
		const value = e.target.value;
		setForm({ ...form, password: value });
	
		if (!passwordPattern.test(value)) {
		  setError({ ...error, password: "Password 8 characters, 1 letter, 1 number, and 1 special character" });
		} else {
		  setError({ ...error, password: "" });
		}
	  };
	
	  const onSubmit = async (e: any) => {
		e.preventDefault();
		let count = 0;
		let objError: any = {
		  name: "",
		  email: "",
		  password: "",
		  cf_password: "",
		};
	
		if (!form.name || form.name == "") {
		  objError.name = "Họ tên không được để trống.";
		  count++;
		}
		if (!form.email || form.email == "") {
		  objError.email = "Email không được để trống.";
		  count++;
		}
		if (!form.password || form.password == "") {
		  objError.password = "Password không được để trống.";
		  count++;
		}
		if (!form.cf_password || form.cf_password == "") {
		  objError.cf_password = "Confirm password không được để trống.";
		  count++;
		}
	
		if (count > 0) {
		  setError(objError);
		  return;
		}
	
		if (form.cf_password !== form.password) {
		  objError.cf_password = "Xác nhận mật khẩu không khớp.";
		  setError(objError);
		  return;
		}
	
		setLoading(true);
		const response: any = await AUTH_SERVICE.register(form);
		setLoading(false);
	
		if (response?.status === "success") {
		  setErrorForm("");
		  window.location.href = "/auth/signin";
		} else {
		  setErrorForm(response?.message || "Lỗi khi đăng ký");
		}
	  };

	  const isFormValid = passwordPattern.test(form.password) && !error.password && !error.cf_password && form.cf_password === form.password;


















	
	

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Sign Up" is_hide={true} />
			{loading && <Loader className={"bg-opacity-60 bg-white z-50 fixed top-0 left-0 w-full h-full"} />}

			<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<div className="flex flex-wrap items-center">
					<div className="hidden w-full xl:block xl:w-1/2">
						<div className="px-26 py-17.5 text-center">
							<Link className="mb-5.5 inline-block" href="/">
								<h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
										TQD System
									</h2>
							</Link>

						
							<div className="flex justify-center">
									
									<Image
										src="/images/logo2.jpg" // Adjust the path to your actual logo file
										alt="Logo"
										width={265} // Adjust the size as needed
										height={265} // Adjust the size as needed
										className="mr-2" // Add a margin to the right of the logo
									/>
								</div>
						</div>
					</div>

					<div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
						<div className="w-full p-4 sm:p-12.5 xl:p-17.5">
							<h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
								Sign Up
							</h2>

							{errorForm && <span className="text-red text-xl text-bold">{errorForm}</span>}
							<form>
								<div className="mb-4">
									<label className="mb-2.5 block font-medium text-black dark:text-white">
										Name
									</label>
									<div className="relative">
										<input
											type="text"
											value={form.name}
											placeholder="Enter your full name"
											onChange={(e) => {
												// let value = e && e.target.value?.trim() || null
												setField(e.target.value, 'name', form, setForm)
											}}
											className={`w-full rounded-lg border 
											${error.name != '' ? 'border-red' : 'border-stroke'}  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
										/>

										<span className="absolute right-4 top-4">
											<svg
												className="fill-current"
												width="22"
												height="22"
												viewBox="0 0 22 22"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g opacity="0.5">
													<path
														d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
														fill=""
													/>
													<path
														d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
														fill=""
													/>
												</g>
											</svg>
										</span>
										{error.name != '' && <span className="text-red text-xl mt-3">{error.name}</span>}

									</div>
								</div>

								<div className="mb-4">
									<label className="mb-2.5 block font-medium text-black dark:text-white">
										Email
									</label>
									<div className="relative">
										<input
											type="email"
											placeholder="Enter your email"
											onChange={(e) => {
												let value = e && e.target.value?.trim() || null
												setField(value, 'email', form, setForm)
											}}
											className={`w-full 
											rounded-lg border 
											${error.email != '' ? 'border-red' : 'border-stroke'} bg-transparent 
											py-4 pl-6 pr-10 text-black outline-none 
											focus:border-primary focus-visible:shadow-none 
											dark:border-form-strokedark dark:bg-form-input 
											dark:text-white dark:focus:border-primary`}
										/>

										<span className="absolute right-4 top-4">
											<svg
												className="fill-current"
												width="22"
												height="22"
												viewBox="0 0 22 22"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g opacity="0.5">
													<path
														d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
														fill=""
													/>
												</g>
											</svg>
										</span>
									</div>
									{error.email != '' && <span className="text-red text-xl mt-3">{error.email}</span>}
								</div>

								<div className="mb-6">
									<label className="mb-2.5 block font-medium text-black dark:text-white">
										Password
									</label>
									<div className="relative">
										{/* <input
											type="password"
											value={form.password}
											onChange={(e) => {
												let value = e && e.target.value?.trim() || null
												setField(value, 'password', form, setForm)
											}}
											placeholder="6+ Characters, 1 Capital letter"
											className={`w-full rounded-lg border 
											${error.email != '' ? 'border-red' : 'border-stroke'} 
											bg-transparent py-4 pl-6 pr-10 dark:text-white outline-none 
											focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
										/> */}



										<input
											type="password"
											value={form.password}
											onChange={handlePasswordChange}
											placeholder="8+ Characters, 1 Letter, 1 Number, 1 Special Character"
											className={`w-full rounded-lg border ${error.password ? "border-red" : "border-stroke"} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
											/>
                    					{error.password && <span className="text-red text-xl mt-3"></span>}
       


										

										<span className="absolute right-4 top-4">
											<svg
												className="fill-current"
												width="22"
												height="22"
												viewBox="0 0 22 22"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g opacity="0.5">
													<path
														d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
														fill=""
													/>
													<path
														d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
														fill=""
													/>
												</g>
											</svg>
										</span>
										{error.password != '' && <span className="text-red text-xl mt-3">{error.password}</span>}

									</div>
								</div>


								<div className="mb-6">
									<label className="mb-2.5 block font-medium text-black dark:text-white">
										Re-type Password
									</label>
									<div className="relative">
										<input
											type="password"
											placeholder="Re-enter your password"
											value={form.cf_password}
											onChange={(e) => {
												let value = e && e.target.value?.trim() || null
												setField(value, 'cf_password', form, setForm)
											}}
											className={`w-full rounded-lg border 
											${error.cf_password != 'border-red' && 'border-stroke'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
										/>

										<span className="absolute right-4 top-4">
											<svg
												className="fill-current"
												width="22"
												height="22"
												viewBox="0 0 22 22"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g opacity="0.5">
													<path
														d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
														fill=""
													/>
													<path
														d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
														fill=""
													/>
												</g>
											</svg>
										</span>
										{error.cf_password != '' && <span className="text-red text-xl mt-3">{error.cf_password}</span>}

									</div>
								</div>

								<div className="mb-5">
									<input
									 disabled={!isFormValid}
										type="submit"
										value="Create account"
										onClick={onSubmit}
										className="w-full cursor-pointer rounded-lg border border-orange bg-orange-500 p-4 text-white transition hover:bg-opacity-90 bg-orange-500 border-orange-500"
									/>
								</div>

								<div className="mt-6 text-center">
									<p>
										Already have an account?{" "}
										<Link href="/auth/signin" className="text-primary">
											Sign in
										</Link>
									</p>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</DefaultLayout>
	);
};

export default SignUp;
