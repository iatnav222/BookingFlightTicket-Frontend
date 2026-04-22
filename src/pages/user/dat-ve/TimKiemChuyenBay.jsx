import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FaPlane, FaChevronLeft, FaChevronRight, FaFilter,
} from 'react-icons/fa';

import { sanBayApi } from '../../../services/Sanbayapi';
import { chuyenBayApi } from '../../../services/chuyenBayApi';
import { hangHangKhongApi } from '../../../services/hangHangKhongApi';

const todayStr = () => new Date().toISOString().split('T')[0];
const formatDateShort = (date) =>
  new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  }).format(date);

const normalizeList = (res) => {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.offers)) return data.offers;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const toMoney = (value) => {
  const n = Number(value || 0);
  return n.toLocaleString('vi-VN');
};

const getFlightPrice = (cb) => {
  if (cb?.gia_thap_nhat) return Number(cb.gia_thap_nhat);

  const fromGhe = cb?.giaVes || cb?.gia_ves || [];
  if (Array.isArray(fromGhe) && fromGhe.length > 0) {
    const first = fromGhe.find(
      (g) =>
        (g.loaiGhe === 'PhoThong' || g.loai_ghe === 'PhoThong') &&
        (g.loaiHanhKhach === 'NguoiLon' || g.loai_hanh_khach === 'NguoiLon')
    );
    if (first) return Number(first.giaTien || first.gia_tien || 0);
  }

  return Number(cb?.giaTien || cb?.gia_tien || 0);
};

const TimKiemChuyenBay = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [error, setError] = useState('');

  const [dsSanBay, setDsSanBay] = useState([]);
  const [dsHangBay, setDsHangBay] = useState([]);
  const [chuyenbays, setChuyenbays] = useState([]);

  const [query, setQuery] = useState({
    maSanBayDi: searchParams.get('maSanBayDi') || '',
    maSanBayDen: searchParams.get('maSanBayDen') || '',
    ngayDi: searchParams.get('ngayDi') || todayStr(),
    ngayVe: searchParams.get('ngayVe') || '',
    loaiVe: searchParams.get('loaiVe') || 'mot-chieu',
    soNguoiLon: Number(searchParams.get('soNguoiLon') || 1),
    soTreEm: Number(searchParams.get('soTreEm') || 0),
    soEmBe: Number(searchParams.get('soEmBe') || 0),
    sort: searchParams.get('sort') || 'gio_som',
    max_price: Number(searchParams.get('max_price') || 10000000),
    hang_bay: searchParams.getAll('hang_bay') || [],
  });

  const toggleHangBay = (maHang) => {
    const code = String(maHang);
    const current = query.hang_bay || [];
    const next = current.includes(code)
      ? current.filter((x) => x !== code)
      : [...current, code];
    syncQuery({ hang_bay: next });
  };


  const [visibleDates, setVisibleDates] = useState([]);

  useEffect(() => {
    const base = new Date(query.ngayDi || todayStr());
    const arr = [];
    for (let i = -2; i <= 2; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      arr.push(d);
    }
    setVisibleDates(arr);
  }, [query.ngayDi]);

  useEffect(() => {
    const fetchMeta = async () => {
      setLoading(true);
      setError('');
      try {
        const [resSB, resHHK] = await Promise.all([
          sanBayApi.getDanhSachClient().catch(() => null),
          hangHangKhongApi.getDanhSachClient().catch(() => null),
        ]);

        setDsSanBay(normalizeList(resSB));
        setDsHangBay(normalizeList(resHHK));
      } catch (e) {
        setError('Không tải được dữ liệu danh mục.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, []);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoadingFlights(true);
      setError('');
      try {
        const params = {
          maSanBayDi: query.maSanBayDi?.split('_')[1]?.toUpperCase(), // HAN
          maSanBayDen: query.maSanBayDen?.split('_')[1]?.toUpperCase(), // SGN

          ngayBay: query.ngayDi,

          adults: query.soNguoiLon,
          children: query.soTreEm,
          infants: query.soEmBe,
        };

        const res = await chuyenBayApi.getDanhSachClient(params);
        const list = normalizeList(res);

        const filtered = list
          .filter((cb) => {
            const price = getFlightPrice(cb);
            return price <= Number(query.max_price || 10000000);
          })
          .filter((cb) => {
            if (!query.hang_bay?.length) return true;
            const maHang =
              cb?.maHang ||
              cb?.hang_hang_khong?.maHang ||
              cb?.hangHangKhong?.maHang ||
              cb?.hang_hang_khong_id;
            return query.hang_bay.includes(String(maHang));
          })
          .sort((a, b) => {
            const priceA = getFlightPrice(a);
            const priceB = getFlightPrice(b);
            const timeA = new Date(a.ngayGioCatCanh || a.ngay_gio_cat_canh || 0).getTime();
            const timeB = new Date(b.ngayGioCatCanh || b.ngay_gio_cat_canh || 0).getTime();

            if (query.sort === 'gio_muon') return timeB - timeA;
            if (query.sort === 'gia_tang') return priceA - priceB;
            return timeA - timeB;
          });

        setChuyenbays(filtered);
      } catch (e) {
        setChuyenbays([]);
        setError('Không tải được danh sách chuyến bay.');
      } finally {
        setLoadingFlights(false);
      }
    };

    if (query.maSanBayDen || query.maSanBayDi || query.ngayDi) {
      fetchFlights();
    }
  }, [query]);

  const syncQuery = (next) => {
    setQuery((prev) => {
      const merged = { ...prev, ...next };
      const params = new URLSearchParams();

      Object.entries(merged).forEach(([key, value]) => {
        if (key === 'hang_bay') {
          (value || []).forEach((v) => params.append('hang_bay[]', v));
          return;
        }
        if (
          value !== '' &&
          value !== null &&
          value !== undefined &&
          !(typeof value === 'number' && Number.isNaN(value))
        ) {
          params.set(key, String(value));
        }
      });

      setSearchParams(params, { replace: true });
      return merged;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.maSanBayDi && query.maSanBayDen && query.maSanBayDi === query.maSanBayDen) {
      alert('Điểm đi và điểm đến không được trùng nhau!');
      return;
    }
    syncQuery({});
  };

  const handleDateChange = (dateStr) => {
    syncQuery({ ngayDi: dateStr });
  };



  const clearFilters = () => {
    const next = {
      maSanBayDi: query.maSanBayDi,
      maSanBayDen: query.maSanBayDen,
      ngayDi: query.ngayDi,
      ngayVe: query.ngayVe,
      loaiVe: query.loaiVe,
      soNguoiLon: query.soNguoiLon,
      soTreEm: query.soTreEm,
      soEmBe: query.soEmBe,
      sort: 'gio_som',
      max_price: 10000000,
      hang_bay: [],
    };
    syncQuery(next);
  };

  const sbDi = useMemo(
    () => dsSanBay.find((x) => String(x.maSanBay) === String(query.maSanBayDi)),
    [dsSanBay, query.maSanBayDi]
  );

  const sbDen = useMemo(
    () => dsSanBay.find((x) => String(x.maSanBay) === String(query.maSanBayDen)),
    [dsSanBay, query.maSanBayDen]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#007bff] border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-600 font-semibold">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f8fb] text-gray-800 min-h-screen">
      <div className="bg-white py-3 border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center gap-4 text-sm md:text-base">
            <div
              className={
                query.loaiVe === 'mot-chieu'
                  ? 'text-primary font-bold text-[#007bff]'
                  : 'text-muted-foreground text-[#007bff] font-bold'
              }
            >
              <i className={`fas ${query.loaiVe ? 'fa-plane-departure' : 'fa-plane-departure'} mr-2`} />
              1. Chọn chiều đi
            </div>

            {query.loaiVe === 'khu-hoi' && (
              <>
                <div className="w-12 border-t border-gray-300" />
                <div className="text-[#007bff] font-bold">
                  <i className="fas fa-plane-arrival mr-2" />
                  2. Chọn chiều về
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-3 mb-5 overflow-x-auto pb-1">
          {visibleDates.map((d) => {
            const dateStr = d.toISOString().split('T')[0];
            const active = dateStr === query.ngayDi;
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => handleDateChange(dateStr)}
                className={`min-w-[102px] rounded-xl border px-3 py-2 text-center transition-all ${active
                  ? 'bg-[#007bff] text-white border-[#007bff] shadow-lg'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <small className="block text-xs opacity-90">{formatDateShort(d)}</small>
                <strong className="block text-base">{d.getDate()}/{d.getMonth() + 1}</strong>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <aside className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="sticky top-[88px]">
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                <div className="mb-4">
                  <div className="text-sm font-bold uppercase text-gray-500 mb-2">Điểm khởi hành</div>
                  <select
                    className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#007bff]"
                    value={query.maSanBayDi}
                    onChange={(e) => syncQuery({ maSanBayDi: e.target.value })}
                  >
                    <option value="">-- Tất cả điểm đi --</option>
                    {dsSanBay.map((sb) => (
                      <option key={sb.maSanBay} value={sb.maSanBay}>
                        {sb.thanhPho} ({sb.maCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="text-sm font-bold uppercase text-gray-500 mb-2">Giá vé cao nhất</div>
                  <input
                    type="range"
                    min="500000"
                    max="10000000"
                    step="100000"
                    value={query.max_price}
                    className="w-full"
                    onChange={(e) => syncQuery({ max_price: Number(e.target.value) })}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>500k</span>
                    <span className="font-bold text-[#007bff]">
                      {toMoney(query.max_price)}đ
                    </span>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="text-sm font-bold uppercase text-gray-500 mb-2">Hãng hàng không</div>
                  <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
                    {dsHangBay.map((hang) => {
                      const checked = (query.hang_bay || []).includes(String(hang.maHang));
                      return (
                        <label
                          key={hang.maHang}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleHangBay(hang.maHang)}
                            className="accent-[#007bff]"
                          />
                          {hang.logo || hang.logo_url ? (
                            <img
                              src={hang.logo || hang.logo_url}
                              alt={hang.tenHang}
                              className="w-7 h-7 object-contain"
                            />
                          ) : (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs rounded border bg-gray-100">
                              {hang.maCode}
                            </span>
                          )}
                          <span className="text-sm text-gray-700">{hang.tenHang}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#007bff] text-white font-bold py-3 hover:bg-[#0056b3] transition-all flex items-center justify-center gap-2"
                >
                  <FaFilter /> Áp dụng lọc
                </button>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full rounded-full border border-gray-300 text-gray-700 font-bold py-3 mt-2 hover:bg-gray-50 transition-all text-sm"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </form>
          </aside>

          <section className="lg:col-span-9">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 mb-4">
              <div>
                <h4 className="text-xl md:text-2xl font-black text-gray-900 m-0">
                  <FaPlane className="inline-block text-[#007bff] mr-2" />
                  {sbDen ? (
                    sbDi ? (
                      <>
                        <span className="text-[#007bff]">CHUYẾN ĐI:</span> {sbDi.thanhPho} - {sbDen.thanhPho}
                      </>
                    ) : (
                      <>
                        <span className="text-[#007bff]">ĐẾN:</span> {sbDen.thanhPho} (Tất cả điểm đi)
                      </>
                    )
                  ) : (
                    <span>Kết quả tìm kiếm</span>
                  )}
                </h4>
                <p className="text-gray-500">
                  {loadingFlights ? 'Đang tải kết quả...' : `(${chuyenbays.length} kết quả)`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="border-0 shadow-sm bg-white rounded-xl px-3 py-2 font-medium outline-none"
                  value={query.sort}
                  onChange={(e) => syncQuery({ sort: e.target.value })}
                >
                  <option value="gio_som">Cất cánh sớm nhất</option>
                  <option value="gio_muon">Cất cánh muộn nhất</option>
                  <option value="gia_tang">Giá thấp nhất</option>
                </select>
              </div>
            </div>

            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4">
                {error}
              </div>
            ) : null}

            <div className="space-y-4">
              {!loadingFlights && chuyenbays.length === 0 ? (
                <div className="text-center py-14 bg-white rounded-3xl shadow-sm border">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <FaPlane className="text-3xl text-gray-400" />
                  </div>
                  <h4 className="text-xl font-bold">Không tìm thấy chuyến bay nào</h4>
                  <p className="text-gray-500 mt-2">
                    Vui lòng thử điều chỉnh bộ lọc hoặc chọn ngày khác.
                  </p>
                </div>
              ) : (
                chuyenbays.map((cb) => {
                  const hang = cb.hang_hang_khong || cb.hangHangKhong || {};
                  const sb1 = cb.san_bay_di || cb.sanBayDi || {};
                  const sb2 = cb.san_bay_den || cb.sanBayDen || {};
                  const price = getFlightPrice(cb);

                  return (
                    <article
                      key={cb.maChuyenBay}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#cce5ff] transition-all cursor-pointer p-5 md:p-6"
                      onClick={() =>
                        navigate(`/dat-ve/chon-ghe/${cb.maChuyenBay}`, {
                          state: {
                            flightDetails: cb,
                           
                            adults: query.soNguoiLon, 
                            children: query.soTreEm, 
                            infants: query.soEmBe  
                          },
                        })
                      }
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-full md:w-20 flex justify-center items-center">
                          {hang.logo || hang.logo_url ? (
                            <img
                              src={hang.logo || hang.logo_url}
                              alt="Logo"
                              className="max-w-full max-h-10 object-contain"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100" />
                          )}
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-sm text-gray-700 mb-1">
                              {hang.tenHang || 'Hãng bay'}
                            </div>
                            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                              <span className="whitespace-nowrap">{sb1.tenSanBay || sb1.maCode || 'Nơi đi'}</span>
                              <span className="text-gray-400 text-xl">→</span>
                              <span className="whitespace-nowrap truncate">{sb2.tenSanBay || sb2.maCode || 'Nơi đến'}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {cb.ngayGioCatCanh
                                ? new Date(cb.ngayGioCatCanh).toLocaleDateString('vi-VN', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                                : ''}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 md:pl-4 md:border-l">
                            <div className="text-right">
                              <div className="text-lg md:text-xl font-medium text-[#007bff]">
                                {toMoney(price)} VND
                              </div>
                              <div className="text-xs text-gray-400">
                                {(cb.duffel_raw?.slices?.length === 2 || cb.loaiVe === 'khu-hoi')
                                  ? 'Khứ Hồi'
                                  : 'Một Chiều'}
                              </div>
                            </div>

                            <div className="text-[#007bff] opacity-60">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {chuyenbays.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  type="button"
                  disabled
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 disabled:opacity-30"
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#007bff] text-white font-bold">
                  1
                </div>
                <button
                  type="button"
                  disabled
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 disabled:opacity-30"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default TimKiemChuyenBay;