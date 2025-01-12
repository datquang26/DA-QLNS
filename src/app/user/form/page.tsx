"use client";
import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { Product } from "@/types/product";
import Link from "next/link";
import { CATEGORY_SERVICE, COMMON_API, ORDER_SERVICE, UPLOAD_SERVICE } from "@/services/api.service";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { buildImage, checkTextOrder, formatMoney, formatTime, formatTime2, getItem, readFile, setField } from "@/services/helpers.service";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import Loader from "@/components/common/Loader";
import CkeditorPage from "@/components/common/CkEditor";
import '../../../assets/style.css'
import axios from "axios";
// import handler from "@/services/configCORS";
import moment from "moment";
import { message  } from "antd";


const INIT_FORM: any = {
	name: '',
	email: '',
	status: "",
	code: null,
	password: "",
	gender: "",
	phone: "",
	avatar: "",
	userType: "USER",
	address: "",
	cccd: "",
	cccdAddress: "",
	cccdDate: "",
	region: "",
	dob: "",
	employerTypeId: "",
	certificateId: "",
	roomId: "",
	userRankId: "",
	cccdImg: ""
};



const UserForm: React.FC = () => {
	
	const [file, setFile] = useState(null);

	const [cccdFile, setCccdFile] = useState(null);

	const [imgBase64, setImgBase64]: any = useState(null);

	const [imgCccd, setImgCccd]: any = useState(null);
	let refFile = useRef(null);
	let refCccdFile = useRef(null);

	const [loading, setLoading] = useState(false);

	const [data, setData]: any = useState({ ...INIT_FORM });


	const [title, setTitle] = useState('Tạo mới');

	const [ranks, setRanks] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [certificates, setCertificates] = useState([]);
	const [employerTypes, setEmployerTypes] = useState([]);

	const [id, setId] = useState(0);
	const params = useSearchParams();
	const [errorFile, setErrorFile] = useState('');
	const user = getItem('user');
	const router = useRouter();
	const [error, setError] = useState({
		...INIT_FORM
	});


	useEffect(() => {
		let id = Number(params.get('id') || 0);

		setId(id);
		if (id) {
			setTitle('Cập nhật');
			getData(id)
		}

		getRoomsData();
		getEmployerTypesData();
		getCertificatesData();
		getRanksData();


	}, [params.get('id')]);


	const getData = async (id: any) => {
		setLoading(true);
		const response: any = await COMMON_API.show('user', id);
		setLoading(false);

		if (response?.status == "success") {
			console.log(response?.data?.avatar)
			setData({
				name: response?.data?.name,
				email: response?.data?.email,
				status: response?.data?.status,
				code: response?.data?.code,
				// password: response?.data?.name,
				gender: response?.data?.gender,
				phone: response?.data?.phone,
				avatar: response?.data?.avatar,
				userType: response?.data?.userType || "USER",
				address: response?.data?.address,
				cccd: response?.data?.cccd,
				cccdAddress: response?.data?.cccdAddress,
				// cccdDate: response?.data?.cccdDate,
				cccdDate: formatTime(response?.data?.cccdDate, 'yyyy-MM-DD'),
				region: response?.data?.region,
				dob: formatTime(response?.data?.dob, 'yyyy-MM-DD'),
				employerTypeId: response?.data?.employerType?.id,
				certificateId: response?.data?.certificate?.id,
				roomId: response?.data?.room?.id,
				userRankId: response?.data?.rank?.id,
				cccdImg: response?.data?.cccdImg
			});
			setImgBase64(response?.data?.avatar)
			setImgCccd(response?.data?.cccdImg)
		}

	}

	const getRoomsData = async () => {
		const response: any = await COMMON_API.getList('room', { page: 1, page_size: 1000 });
		if (response?.status == "success") {
			setRooms(response?.data)
		}

	}

	const getCertificatesData = async () => {
		const response: any = await COMMON_API.getList('certificate', { page: 1, page_size: 1000 });

		if (response?.status == "success") {
			setCertificates(response?.data)
		}

	}

	const getRanksData = async () => {
		const response: any = await COMMON_API.getList('rank', { page: 1, page_size: 1000 });

		if (response?.status == "success") {
			setRanks(response?.data)
		}

	}

	const getEmployerTypesData = async () => {
		const response: any = await COMMON_API.getList('employer-type', { page: 1, page_size: 1000 });

		if (response?.status == "success") {
			setEmployerTypes(response?.data)
		}

	}

	const submit = async (e: any) => {
		e.preventDefault();
		let response: any;
		let bodyData: FormData = new FormData();

		let count = 0;
		let objError = {
			...INIT_FORM
		}
		if (!data.name || data.name == '') {
			objError.name = 'Tên phòng không được để trống.'
			count++;
		}

		if (!data.status || data.status?.trim() == '') {
			objError.status = 'Trạng thái không được để trống.'
			count++;
		}

		if (!data.cccd || data.cccd?.trim() == '') {
			objError.cccd = 'CCCD không được để trống.'
			count++;
		}

		if (!data.cccdAddress || data.cccdAddress?.trim() == '') {
			objError.cccdAddress = 'Quê quán không được để trống.'
			count++;
		}

		if (!data.address || data.address?.trim() == '') {
			objError.address = 'Thường trú không được để trống.'
			count++;
		}

		if (!data.userRankId || data.userRankId == '') {
			objError.userRankId = 'Chức vụ không được để trống.'
			count++;
		}

		if (!data.roomId || data.roomId == '') {
			objError.roomId = 'Phòng ban không được để trống.'
			count++;
		}

		if (!data.employerTypeId || data.employerTypeId == '') {
			objError.employerTypeId = 'Loại nhân viên không được để trống.'
			count++;
		}

		if (!data.email || data.email?.trim() == '') {
			objError.email = 'Email nhân viên không được để trống.'
			count++;
		}

		if (!id) {
			if (!data.password || data.password == '') {
				objError.password = 'Mật khẩu không được để trống.'
				count++;
			}
		}


		if (count > 0) {
			setError(objError);
			return;
		}

		if (file) {
			const blob = new Blob([file]);
			bodyData.append('avatar', blob);
		}

		if (cccdFile) {
			const blob = new Blob([cccdFile]);
			bodyData.append('cccdImg', blob);
		}

		bodyData.append("address", data.address);
		bodyData.append("cccd", data.cccd);
		bodyData.append("cccdAddress", data.cccdAddress);
		bodyData.append("cccdDate", data.cccdDate);
		bodyData.append("certificateId", data.certificateId);
		bodyData.append("dob", data.dob);
		bodyData.append("email", data.email);
		bodyData.append("employerTypeId", data.employerTypeId);
		bodyData.append("gender", data.gender);
		bodyData.append("name", data.name);
		bodyData.append("password", data.password);
		bodyData.append("phone", data.phone);
		bodyData.append("region", data.region);
		bodyData.append("roomId", data.roomId);
		bodyData.append("status", data.status);
		bodyData.append("userRankId", data.userRankId);
		bodyData.append("userType", data.userType);
		setLoading(true);

		if (id) {
			response = await COMMON_API.update2('user', id, bodyData);
			message.success("Cập nhật user thành công")
		} else {
			response = await COMMON_API.store2('user', bodyData);
			message.success("Thêm user thành công")
		}
		setLoading(false);

		// if (response?.status == 'success') {
		// 	resetForm()
		// 	router.push('/user');
		// }
	}

	const resetForm = () => {
		setData({ ...INIT_FORM });
	}



	const changeFile = async (e: any) => {
		e.preventDefault();

		if (e.target.files) {
			setFile(e.target.files[0]);
			readFile(e?.target?.files[0], setFile, setImgBase64)
		}
	}

	const validateCCCD = async (file: any) => {
		setLoading(true);
		const res = await UPLOAD_SERVICE.validateCCCD(file);
		if (!res || res?.data?.errorCode !== 0) {
			message.error('Đọc căn cước thất bại!'); 
		} else {
			const data = res?.data?.data?.[0];
			setData({
				name: data.name,
				gender: data.sex,
				address: data.address,
				cccd: data.id,
				cccdAddress: data.home,
				region: data.nationality,
				dob: moment(data.dob, 'DD/MM/YYYY').format('YYYY-MM-DD'),
				cccdDate: moment(data.doe, 'DD/MM/YYYY').format('YYYY-MM-DD'),
			});
		}
		setLoading(false);
	}

	const changeCccd = async (e: any) => {
		e.preventDefault();
		if (e.target.files) {
			setCccdFile(e.target.files[0]);
			readFile(e?.target?.files[0], setCccdFile, setImgCccd)
			
			validateCCCD(e.target.files[0])
		}
		
	}
	return (
		<DefaultLayout>
			<Breadcrumb pageName={title} subName="Phòng ban" />
			<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
					<h3 className="font-medium text-black dark:text-white text-2xl">
						{title}
					</h3>
				</div>
				{loading && <Loader className={"bg-opacity-60 bg-white z-50 fixed top-0 left-0 w-full h-full"} />}

				<div className="flex flex-col gap-5.5 p-6.5">
					<form>
						<div className="md:grid md:grid-cols-2 md:gap-4">
							<div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Tên nhân viên
								</label>
								<input
									disabled
									type="text"
									placeholder="Tên nhân viên"
									defaultValue={data.name}
									onChange={e => {
										setField(e?.target?.value, 'name', data, setData);
									}}
									className={`w-full	 rounded-lg border-[1.5px] ${error.name != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>
								{error.name != '' && <span className="text-red text-xl mt-3">{error.name}</span>}

							</div>

							{id ? <div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Mã nhân viên
								</label>
								<input
									type="text"
									placeholder="Mã nhân viên"
									defaultValue={data.code}
									readOnly
									className={`w-full	 rounded-lg border-[1.5px] ${error.code != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>

							</div> : ''}

							<div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Email
								</label>
								<input
									type="email"
									placeholder="Email"
									defaultValue={data.email}
									onChange={e => {
										setField(e?.target?.value, 'email', data, setData);
									}}
									className={`w-full	 rounded-lg border-[1.5px] ${error.email != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>
								{error.email != '' && <span className="text-red text-xl mt-3">{error.email}</span>}

							</div>

							{!id && <div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Mật khẩu
								</label>
								<input
									type="password"
									placeholder="Mật khẩu"
									defaultValue={data.password}
									onChange={e => {
										setField(e?.target?.value, 'password', data, setData);
									}}
									className={`w-full	 rounded-lg border-[1.5px] ${error.password != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>
								{error.password != '' && <span className="text-red text-xl mt-3">{error.name}</span>}

							</div>}
							<div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Số điện thoại
								</label>
								<input
									type="text"
									placeholder="Số điện thoại"
									defaultValue={data.phone}
									onChange={e => {
										setField(e?.target?.value, 'phone', data, setData);
									}}
									className={`w-full	 rounded-lg border-[1.5px] ${error.phone != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>
								{error.phone != '' && <span className="text-red text-xl mt-3">{error.phone}</span>}

							</div>



							<div className="mb-5 form">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Căn cước công dân
								</label>
								<input
									type="file"
									ref={ refCccdFile }
									style={{visibility: 'hidden'}}
									accept="image/*"

									onChange={(e) => changeCccd(e)}
								/>
								<img src={imgCccd || "/images/image_faildoad.png"} className="avatar d-flex mx-auto cursor-pointer" onClick={
									e => {
										if (refCccdFile?.current) refCccdFile.current.click();
									}
								} />
								{errorFile != '' && <span className="text-red text-xl mt-3">{errorFile}</span>}
							</div>



							<div className="mb-5 form">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Ảnh đại diện
								</label>
								<input
									type="file"
									ref={ refFile }
									style={{visibility: 'hidden'}}
									accept="image/*"

									onChange={(e) => changeFile(e)}
								/>
								<img src={imgBase64 || "/images/image_faildoad.png"} className="avatar d-flex mx-auto cursor-pointer" onClick={
									e => {
										if (refFile?.current) refFile.current.click();
									}
								} />
								{errorFile != '' && <span className="text-red text-xl mt-3">{errorFile}</span>}
							</div>

							<div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Ngày sinh
								</label>
								<input
									disabled
									type="date"
									placeholder="Ngày sinh"
									defaultValue={data.dob}
									onChange={e => {
										setField(e?.target?.value, 'dob', data, setData);
									}}
									className={`w-full	 rounded-lg border-[1.5px] ${error.dob != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>
								{error.dob != '' && <span className="text-red text-xl mt-3">{error.dob}</span>}

							</div>
							<div className="mb-5">
								<SelectGroupTwo
									title={'Trạng thái'}
									options={[
										{
											id: "ACTIVE",
											name: 'Đang làm việc'
										},
										{
											id: "INACTIVE",
											name: 'Đã nghỉ việc'
										}
									]}
									key_obj={'status'}
									value={data.status}
									form={data}
									setForm={setData}
									
								/>
								{error.status != '' && <span className="text-red text-xl mt-3">{error.status}</span>}


							</div>
							<div className="mb-5 ">
								<SelectGroupTwo
									title={'Giới tính'}
									options={[
										{
											id: "MALE",
											name: 'Nam'
										},
										{
											id: "FEMALE",
											name: 'Nữ'
										},
										{
											id: "OTHER",
											name: 'Khác'
										}
									]}
									key_obj={'gender'}
									value={data.gender}
									form={data}
									setForm={setData}
									disabled={true}
							
								/>

							</div>

							<div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Địa chỉ thường trú
								</label>
								<input
									disabled
									type="text"
									placeholder="Địa chỉ hiện tại"
									defaultValue={data.address}
									onChange={e => {
										setField(e?.target?.value, 'address', data, setData);
									}}
									className={`w-full	 rounded-lg border-[1.5px] ${error.address != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>
								{error.address != '' && <span className="text-red text-xl mt-3">{error.address}</span>}

							</div>

							<div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Hộ khẩu
								</label>
								<input
									disabled
									type="text"
									placeholder="Hộ khẩu"
									defaultValue={data.cccdAddress}
									onChange={e => {
										setField(e?.target?.value, 'cccdAddress', data, setData);
									}}
									className={`w-full	 rounded-lg border-[1.5px] ${error.cccdAddress != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>
								{error.cccdAddress != '' && <span className="text-red text-xl mt-3">{error.cccdAddress}</span>}

							</div>

							<div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Số Căn cước
								</label>
								<input
									disabled
									type="text"
									placeholder="Số Căn cước"
									defaultValue={data.cccd}
									onChange={e => {
										setField(e?.target?.value, 'cccd', data, setData);
									}}
									className={`w-full	 rounded-lg border-[1.5px] ${error.cccd != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>
								{error.cccd != '' && <span className="text-red text-xl mt-3">{error.cccd}</span>}

							</div>

							<div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Có giá tri đến
								</label>
								<input
									type="date"
									placeholder="Tên nhân viên"
									defaultValue={data.cccdDate}
									// value={data.cccdDate}
									onChange={e => {
										setField(e?.target?.value, 'cccdDate', data, setData);
									}}
									className={`w-full	 rounded-lg border-[1.5px] ${error.cccdDate != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>
								{error.cccdDate != '' && <span className="text-red text-xl mt-3">{error.cccdDate}</span>}

							</div>

							<div className="mb-5">
								<label className="mb-3 text-xl block text-sm font-medium text-black dark:text-white">
									Quốc tịch
								</label>
								<input
									disabled
									type="text"
									placeholder="Quốc tịch"
									defaultValue={data.region}
									onChange={e => {
										setField(e?.target?.value, 'region', data, setData);
									}}
									className={`w-full	 rounded-lg border-[1.5px] ${error.region != '' ? ' border-red ' : ''} border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white`}
								/>
								{error.region != '' && <span className="text-red text-xl mt-3">{error.region}</span>}

							</div>


							<div className="mb-5">
								<SelectGroupTwo
									title={'Chức vụ'}
									options={ranks}
									key_obj={'userRankId'}
									value={data.userRankId}
									form={data}
									setForm={setData}
								/>
								{error.userRankId != '' && <span className="text-red text-xl mt-3">{error.userRankId}</span>}
							</div>
							<div className="mb-5">
								<SelectGroupTwo
									title={'Phòng ban'}
									options={rooms}
									key_obj={'roomId'}
									value={data.roomId}
									form={data}
									setForm={setData}
								/>
								{error.roomId != '' && <span className="text-red text-xl mt-3">{error.roomId}</span>}
							</div>
							<div className="mb-5">
								<SelectGroupTwo
									title={'Bằng cấp'}
									options={certificates}
									key_obj={'certificateId'}
									value={data.certificateId}
									form={data}
									setForm={setData}
								/>
								{error.certificateId != '' && <span className="text-red text-xl mt-3">{error.certificateId}</span>}
							</div>
							<div className="mb-5">
								<SelectGroupTwo
									title={'Loại nhân viên'}
									options={employerTypes}
									key_obj={'employerTypeId'}
									value={data.employerTypeId}
									form={data}
									setForm={setData}
								/>
								{error.employerTypeId != '' && <span className="text-red text-xl mt-3">{error.employerTypeId}</span>}
							</div>
						</div>
						{/* <CkeditorPage
							title={'Chi tiết phòng ban'}
							key_obj={'description'}
							value={data.description}
							form={data}
							setForm={setData}
						/> */}
						<div className="flex justify-center mt-5">
							<Link href={'/user'} className="inline-flex items-center justify-center 
							rounded-md bg-gray mr-3 px-5 py-2 text-center 
							font-medium hover:bg-gray-900 lg:px-8 xl:px-10">
								Hủy
							</Link>
							<button className="inline-flex items-center justify-center
							rounded-md bg-orange-400 px-5 py-2 text-center
							font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
								onClick={(e) => submit(e)}
							>Xác nhận</button>
						</div>
					</form>
				</div>
			</div>
		</DefaultLayout>
	);
};

export default UserForm;
