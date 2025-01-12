"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

import { Product } from "@/types/product";
import { INIT_PAGING, WEB_VALUE } from "@/services/constant";
import { COMMON_API, ORDER_SERVICE } from "@/services/api.service";
import { buildImage, formatMoney, formatTime, getItem, onErrorUser } from "@/services/helpers.service";
import { PagingPage } from "@/components/common/paging";
import Loader from "@/components/common/Loader";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { USER_API } from "@/services/api.service";



const OrderList: React.FC = () => {

	const [dataList, setDataList] = useState([]);
	const [paging, setPaging] = useState(INIT_PAGING);
	const [loading, setLoading] = useState(false);
	const [searchUser, setSearchUser] = useState("");

	useEffect(() => {
		getDataList({ ...paging })
	}, []);

	const getDataList = async (filters: any) => {
		setLoading(true);
		const response: any = await COMMON_API.getList('user', filters);
		setLoading(false);
		if (response?.status == 'success') {
			setDataList(response.data || []);
			setPaging(response.meta || INIT_PAGING);
		}
	}


	// Khai báo state để lưu giá trị ô input
	const [searchTerm, setSearchTerm] = useState("");
	
	// Xử lý khi thay đổi giá trị trong ô input
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e.target.value)
		setSearchTerm(e.target.value);
	}
	
	// Xử lý sự kiện khi nhấn nút "Tìm kiếm"
	const handleSearch = async () => {
		if (searchTerm.trim()) {
		try {
			// Gọi API với tên người dùng tìm kiếm
			const response = await USER_API.searchUser(searchTerm);
			if(!response.data){
				setDataList([])
				return
			}
			setDataList([response.data]);
			console.log(response.data); // Xử lý kết quả API nếu cần
		} catch (error) {
			console.error("Lỗi khi tìm kiếm:", error);
		}
		} else {
		console.log("Vui lòng nhập tên tìm kiếm!");
		}
	}
	

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Danh sách" subName="Nhân viên" />

			<div className="flex flex-col gap-10">
				<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
					<div className="px-4 py-6 md:px-6 xl:px-7.5 md:flex md:justify-between w-full">
						<h4 className="text-xl font-semibold text-black dark:text-white">
							Danh sách
						</h4>
						<Link href={'/user/form'} className="inline-flex items-center justify-center rounded-md bg-orange-400 px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">Tạo mới</Link>
					</div>






					<div className="flex items-center gap-4 px-2 py-2 pl-4">
						<input
							type="text"
							placeholder="Tìm kiếm tên nhân viên..."
							className="px-4 py-2 border rounded-md text-sm dark:bg-boxdark dark:text-white"
							value={searchTerm}  // Trạng thái của ô input tìm kiếm
							onChange={handleSearchChange} // Xử lý thay đổi giá trị tìm kiếm
						/>
						<button
							onClick={handleSearch}  // Hàm xử lý tìm kiếm
							className="bg-orange-400 text-white px-6 py-2 rounded-md hover:bg-opacity-90 lg:px-8 xl:px-10"
						>
							Tìm kiếm
						</button>
						<button
							onClick={()=> {
								getDataList({ ...paging })
							}}  // Hàm xử lý tìm kiếm
							// className="bg-orange-400 text-white px-6 py-2 rounded-md hover:bg-opacity-90 lg:px-8 xl:px-10"
							className="inline-flex items-center justify-center 
							rounded-md bg-gray mr-3 px-5 py-2 text-center 
							font-medium hover:bg-gray-900 lg:px-8 xl:px-10"
						>
							Đặt lại
						</button>
            		</div>



					{loading && <Loader className={"bg-opacity-60 bg-white z-50 fixed top-0 left-0 w-full h-full"} />}
					<>
						{dataList.length == 0 ? 
							<div>Không có dữ liệu</div>	: 
							<>
								<div className="px-4">
						<div className="max-w-full overflow-x-auto">
							<table className="w-full table-auto">
								<thead>
									<tr className="bg-gray-2 text-left dark:bg-meta-4">
										<th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
											Mã NV
										</th>
										<th className="min-w-[220px] py-4 px-4 font-medium text-nowrap
									text-black dark:text-white xl:pl-11">
											Tên NV
										</th>
										<th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
											Avatar
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Trạng thái
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Giới tính
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Ngày sinh
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Nguyên quán
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											CCCD
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Ngày cấp
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Quốc tịch
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Thường trú
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Chức vụ
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Bằng cấp
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Phòng ban
										</th>
										<th className=" py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Loại nhân viên
										</th>

										<th className="py-4 px-4 font-medium text-black dark:text-white text-nowrap">
											Thao tác
										</th>
									</tr>
								</thead>
								<tbody>
									{dataList.map((item: any, key: any) => (
										<tr key={key}>
											<td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
												<p className="font-medium text-black dark:text-white cursor-pointer"
												// onClick={() => updateData(item)}
												>
													{item.code}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black font-medium dark:text-white text-nowrap">
													{item.name}
												</p>
												<span className="">Email: {item.email}</span>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<img src={(item.avatar) || "/images/image_faildoad.png"} 
												onError={(e) => onErrorUser(e)}
												width={80} height={80} />

											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className={`dark:text-white ${item.status == "ACTIVE" ? 'text-success' : 'text-red'}`}>
													{item.status == "ACTIVE" ? "Đang làm việc" : "Nghỉ"}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{item.gender == "MALE" ? "Nam" : (item.gender == "FEMALE" ? "Nữ" : "Khác")}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{formatTime(item.dob, 'DD/MM/yyyy')}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{(item.cccdAddress)}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{(item.cccd)}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{formatTime(item.cccdDate, 'DD/MM/yyyy')}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{item.region || 'Việt Nam'}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{item.address}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{item.rank?.name}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{item.certificate?.name}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{item.room?.name}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black dark:text-white">
													{item.employerType?.name}
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<div className="flex items-center space-x-3.5">
													<Link href={'/user/form?id=' + item.id} className="hover:text-orange-400"
													>
														<FaPencil />
													</Link>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="mt-3 py-5">
						<PagingPage paging={paging}
							setPaging={setPaging}
							onPageChange={(e: any) => {
								getDataList({ page: e, page_size: paging.page_size })
							}} />
					</div>
							
							
							 </>
					}
					</>
					
				</div>
			</div>
		</DefaultLayout>
	);
};

export default OrderList;
