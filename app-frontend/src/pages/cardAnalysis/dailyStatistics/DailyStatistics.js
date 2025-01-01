import React, { useState, useEffect } from 'react';
import Calendar from './calendar/Calendar';
import styled from 'styled-components';
import CommonCardListBox from '../../../common/CommonCardListBox';
import { ReactComponent as ExcellentCoin } from '../../../assets/images/ExcellentCoin.svg';
import { ReactComponent as VeryGoodCoin } from '../../../assets/images/VeryGoodCoin.svg';
import { ReactComponent as GoodCoin } from '../../../assets/images/GoodCoin.svg';
import { ReactComponent as BadCoin } from '../../../assets/images/BadCoin.svg';
import { fetchDailyStatistics } from '../../../apis/dailyStatisticsApi.js';
import CircularProgress from '@mui/material/CircularProgress';

const Root = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 700px 1fr;
  gap: 30px;
  box-sizing: border-box;
`;
const CalendarBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const CalendarBottomBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  margin-top: 5px;
  & div {
    display: flex;
    align-items: center;
  }
  & p {
    margin: 0 0 0 8px;
    font-size: ${(props) => props.theme.fontSize.sm};
    color: ${(props) => props.theme.color.lightGray};
  }
  & svg {
    width: 20px;
    height: 20px;
  }
`;

const ListBox = styled.div`
  height: 541px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const EmptyBox = styled.div`
  width: 100%;
  height: 541px;
  border-radius: 7px;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.color.mediumGray};
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & p {
    margin: 0px;
    font-size: ${(props) => props.theme.fontSize.eighteen};
    color: ${(props) => props.theme.color.gray};
  }
  & .MuiCircularProgress-root {
    margin-bottom: 10px;
  }
`;

const DailyStatistics = () => {
  const Lists = [
    { icon: <BadCoin />, text: '0~25% 소비절약' },
    { icon: <GoodCoin />, text: '26~50% 소비절약' },
    { icon: <VeryGoodCoin />, text: '51~75% 소비절약' },
    { icon: <ExcellentCoin />, text: '76~100% 소비절약' },
  ];

  const [statistics, setStatistics] = useState([]);
  const [filteredStatistics, setFilteredStatistics] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDailyStatistics(); // API 호출
        setStatistics(data);
        setFilteredStatistics(data); // 처음음 통계 설정
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setIsLoading(false); // 데이터 로드 완료 후 로딩 상태 false
      }
    };

    fetchStatistics();
  }, []);

  // 선택한 형식날짜를 YYYY-MM-DD 형식으로
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 선택한 날짜를 기준으로 통계 필터링
  useEffect(() => {
    const formattedDate = formatDate(selectedDate);
    const filtered = statistics.filter(
      (item) => formatDate(new Date(item.dailyDate)) === formattedDate,
    );
    setFilteredStatistics(filtered);
  }, [selectedDate, statistics]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <Root>
      <CalendarBox>
        <Calendar
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          statistics={statistics}
        />
        <CalendarBottomBox>
          {Lists.map((item, index) => (
            <div key={index}>
              {item.icon}
              <p>{item.text}</p>
            </div>
          ))}
        </CalendarBottomBox>
      </CalendarBox>

      <ListBox>
        {isLoading ? (
          <EmptyBox>
            <CircularProgress />
            <p>데이터 불러오는 중...</p>
          </EmptyBox>
        ) : filteredStatistics && filteredStatistics.length > 0 ? (
          filteredStatistics.map((item) => (
            <CommonCardListBox
              key={item.dailyId}
              cardItem={item}
              showDetailed={false}
            />
          ))
        ) : (
          <EmptyBox>
            <p>소비 내역이 없습니다.</p>
          </EmptyBox>
        )}
      </ListBox>
    </Root>
  );
};
export default DailyStatistics;
